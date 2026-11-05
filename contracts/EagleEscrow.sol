// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EagleEscrow Protocol
 * @notice AI-Verifiable, Sybil-Resistant International Service Escrow Protocol.
 * Built for ETHGlobal Hackathon.
 *
 * Integrates:
 * 1. World ID (Proof of Humanity / Sybil-Resistance)
 * 2. 0G Decentralized Storage (Verifiable Milestone Deliverable Hashes)
 * 3. ERC-20 (USDC/USDT) & Native Multi-Chain Settlement
 */

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}

contract EagleEscrow {
    enum EscrowStatus {
        Created,
        Funded,
        DeliverableSubmitted,
        Completed,
        Disputed,
        Refunded
    }

    struct Milestone {
        string title;
        uint256 amount;
        string zeroGStorageHash; // 0G Labs Decentralized Storage CID/Root
        bool isSubmitted;
        bool isApproved;
    }

    struct EscrowAgreement {
        bytes32 agreementId;
        address client;
        address serviceProvider;
        address tokenAddress; // address(0) for native ETH/POL
        uint256 totalAmount;
        uint256 amountReleased;
        EscrowStatus status;
        bool clientWorldIDVerified;
        string ensIdentifier; // e.g. "invoice-101.eaglebyte.eth"
        uint256 createdAt;
        uint256 milestoneCount;
    }

    // Storage
    mapping(bytes32 => EscrowAgreement) public agreements;
    mapping(bytes32 => mapping(uint256 => Milestone)) public agreementMilestones;
    mapping(uint256 => bool) public nullifierHashes; // Prevent World ID double-spending

    // World ID Verifier parameters (World ID router on Sepolia/Optimism)
    IWorldID public immutable worldId;
    uint256 internal immutable groupId = 1; // 1 = orb verified, 0 = device
    uint256 internal immutable externalNullifier;

    // Events
    event EscrowCreated(
        bytes32 indexed agreementId,
        address indexed client,
        address indexed serviceProvider,
        uint256 totalAmount,
        address token,
        string ensIdentifier,
        bool worldIdVerified
    );

    event MilestoneFunded(bytes32 indexed agreementId, uint256 amount);

    event DeliverableSubmitted(
        bytes32 indexed agreementId,
        uint256 indexed milestoneIndex,
        string zeroGStorageHash
    );

    event MilestoneApproved(
        bytes32 indexed agreementId,
        uint256 indexed milestoneIndex,
        uint256 amountReleased
    );

    event EscrowDisputed(bytes32 indexed agreementId, address initiatedBy);
    event EscrowRefunded(bytes32 indexed agreementId, uint256 amountRefunded);

    constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
        worldId = _worldId;
        externalNullifier = uint256(
            keccak256(abi.encodePacked(keccak256(abi.encodePacked(_appId)), _actionId))
        );
    }

    /**
     * @notice Create a new Escrow Agreement with optional World ID Sybil Verification
     */
    function createEscrow(
        address _serviceProvider,
        address _tokenAddress,
        string memory _ensIdentifier,
        string[] memory _milestoneTitles,
        uint256[] memory _milestoneAmounts,
        // World ID ZK-Proof parameters (optional / can be zero if skipped on testnets)
        uint256 _root,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external payable returns (bytes32 agreementId) {
        require(_serviceProvider != address(0), "Invalid provider address");
        require(_milestoneTitles.length == _milestoneAmounts.length, "Mismatched milestones");
        require(_milestoneTitles.length > 0, "At least 1 milestone required");

        agreementId = keccak256(
            abi.encodePacked(msg.sender, _serviceProvider, block.timestamp, _ensIdentifier)
        );
        require(agreements[agreementId].client == address(0), "Escrow already exists");

        uint256 calculatedTotal = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            calculatedTotal += _milestoneAmounts[i];
        }

        bool isWorldIdValid = false;
        if (_nullifierHash != 0 && address(worldId) != address(0)) {
            require(!nullifierHashes[_nullifierHash], "World ID nullifier already used");
            worldId.verifyProof(
                _root,
                groupId,
                uint256(keccak256(abi.encodePacked(msg.sender))),
                _nullifierHash,
                externalNullifier,
                _proof
            );
            nullifierHashes[_nullifierHash] = true;
            isWorldIdValid = true;
        }

        EscrowAgreement storage agreement = agreements[agreementId];
        agreement.agreementId = agreementId;
        agreement.client = msg.sender;
        agreement.serviceProvider = _serviceProvider;
        agreement.tokenAddress = _tokenAddress;
        agreement.totalAmount = calculatedTotal;
        agreement.status = EscrowStatus.Created;
        agreement.clientWorldIDVerified = isWorldIdValid;
        agreement.ensIdentifier = _ensIdentifier;
        agreement.createdAt = block.timestamp;
        agreement.milestoneCount = _milestoneTitles.length;

        for (uint256 i = 0; i < _milestoneTitles.length; i++) {
            agreementMilestones[agreementId][i] = Milestone({
                title: _milestoneTitles[i],
                amount: _milestoneAmounts[i],
                zeroGStorageHash: "",
                isSubmitted: false,
                isApproved: false
            });
        }

        // If native value sent, fund immediately
        if (_tokenAddress == address(0)) {
            require(msg.value == calculatedTotal, "Incorrect ETH sent");
            agreement.status = EscrowStatus.Funded;
            emit MilestoneFunded(agreementId, msg.value);
        }

        emit EscrowCreated(
            agreementId,
            msg.sender,
            _serviceProvider,
            calculatedTotal,
            _tokenAddress,
            _ensIdentifier,
            isWorldIdValid
        );
    }

    /**
     * @notice Fund an ERC-20 escrow (USDC/USDT)
     */
    function fundEscrowERC20(bytes32 _agreementId) external {
        EscrowAgreement storage agreement = agreements[_agreementId];
        require(agreement.client != address(0), "Escrow does not exist");
        require(agreement.status == EscrowStatus.Created, "Already funded or completed");
        require(agreement.tokenAddress != address(0), "Not an ERC20 agreement");

        agreement.status = EscrowStatus.Funded;
        require(
            IERC20(agreement.tokenAddress).transferFrom(
                msg.sender,
                address(this),
                agreement.totalAmount
            ),
            "ERC20 transfer failed"
        );

        emit MilestoneFunded(_agreementId, agreement.totalAmount);
    }

    /**
     * @notice Service Provider submits milestone deliverables pinned to 0G Decentralized Storage
     */
    function submitMilestoneDeliverable(
        bytes32 _agreementId,
        uint256 _milestoneIndex,
        string memory _zeroGStorageHash
    ) external {
        EscrowAgreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.serviceProvider, "Only service provider");
        require(agreement.status == EscrowStatus.Funded || agreement.status == EscrowStatus.DeliverableSubmitted, "Invalid status");
        require(_milestoneIndex < agreement.milestoneCount, "Milestone index out of bounds");

        Milestone storage milestone = agreementMilestones[_agreementId][_milestoneIndex];
        require(!milestone.isApproved, "Milestone already approved");

        milestone.zeroGStorageHash = _zeroGStorageHash;
        milestone.isSubmitted = true;
        agreement.status = EscrowStatus.DeliverableSubmitted;

        emit DeliverableSubmitted(_agreementId, _milestoneIndex, _zeroGStorageHash);
    }

    /**
     * @notice Client approves milestone and releases funds
     */
    function approveMilestone(bytes32 _agreementId, uint256 _milestoneIndex) external {
        EscrowAgreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.client, "Only client can approve");
        require(_milestoneIndex < agreement.milestoneCount, "Milestone out of bounds");

        Milestone storage milestone = agreementMilestones[_agreementId][_milestoneIndex];
        require(milestone.isSubmitted, "Milestone not submitted yet");
        require(!milestone.isApproved, "Milestone already approved");

        milestone.isApproved = true;
        agreement.amountReleased += milestone.amount;

        // Release funds
        if (agreement.tokenAddress == address(0)) {
            (bool success, ) = agreement.serviceProvider.call{value: milestone.amount}("");
            require(success, "ETH transfer failed");
        } else {
            require(
                IERC20(agreement.tokenAddress).transfer(agreement.serviceProvider, milestone.amount),
                "Token transfer failed"
            );
        }

        emit MilestoneApproved(_agreementId, _milestoneIndex, milestone.amount);

        if (agreement.amountReleased >= agreement.totalAmount) {
            agreement.status = EscrowStatus.Completed;
        }
    }

    /**
     * @notice Dispute an escrow (raises dispute for decentralized arbitration)
     */
    function raiseDispute(bytes32 _agreementId) external {
        EscrowAgreement storage agreement = agreements[_agreementId];
        require(
            msg.sender == agreement.client || msg.sender == agreement.serviceProvider,
            "Unauthorized"
        );
        require(agreement.status == EscrowStatus.Funded || agreement.status == EscrowStatus.DeliverableSubmitted, "Cannot dispute");

        agreement.status = EscrowStatus.Disputed;
        emit EscrowDisputed(_agreementId, msg.sender);
    }
}
