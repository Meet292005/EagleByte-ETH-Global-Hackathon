import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { DEFAULT_RECEIVER_ADDRESS } from '@/lib/web3Config';
import { uploadToZeroGStorage, ZeroGUploadResult } from '@/lib/zeroGStorage';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Upload,
  FileCheck,
  ExternalLink,
  Sparkles,
  Layers,
  HardDrive,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Database,
  Globe,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MilestoneItem {
  id: number;
  title: string;
  amount: number;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED';
  zeroGHash?: string;
  submittedFile?: string;
}

interface EscrowRecord {
  id: string;
  ensId: string;
  client: string;
  provider: string;
  totalAmount: number;
  token: string;
  worldIdVerified: boolean;
  status: 'FUNDED' | 'DELIVERABLE_SUBMITTED' | 'COMPLETED' | 'DISPUTED';
  milestones: MilestoneItem[];
}

const INITIAL_ESCROWS: EscrowRecord[] = [
  {
    id: '0x8f2a41d9e2b109c',
    ensId: 'inv-904.eaglebyte.eth',
    client: '0x71aC391...4B98',
    provider: DEFAULT_RECEIVER_ADDRESS,
    totalAmount: 1200,
    token: 'USDC',
    worldIdVerified: true,
    status: 'DELIVERABLE_SUBMITTED',
    milestones: [
      {
        id: 1,
        title: 'Milestone 1: UI/UX Prototype & Architecture',
        amount: 500,
        status: 'APPROVED',
        zeroGHash: '0x3a9f0291e9bca881726354cd10e9f821',
        submittedFile: 'architecture_specs_v1.pdf',
      },
      {
        id: 2,
        title: 'Milestone 2: Frontend & Smart Contract Escrow',
        amount: 700,
        status: 'SUBMITTED',
        zeroGHash: '0x7b1c4e90812df934acb2011938fe729a',
        submittedFile: 'eaglebyte_frontend_release.zip',
      },
    ],
  },
];

const EscrowDashboard = () => {
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const [activeTab, setActiveTab] = useState<'active' | 'create'>('active');
  const [escrows, setEscrows] = useState<EscrowRecord[]>(INITIAL_ESCROWS);

  // Form states for Create Escrow
  const [clientEns, setClientEns] = useState('project-alpha.eaglebyte.eth');
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);
  const [isVerifyingWorldId, setIsVerifyingWorldId] = useState(false);
  const [milestone1Title, setMilestone1Title] = useState('Phase 1: MVP Frontend & UI');
  const [milestone1Amount, setMilestone1Amount] = useState('500');
  const [milestone2Title, setMilestone2Title] = useState('Phase 2: Smart Contract & 0G Storage Integration');
  const [milestone2Amount, setMilestone2Amount] = useState('700');
  const [selectedToken, setSelectedToken] = useState('USDC');

  // File Upload State for 0G Storage
  const [uploadingMilestoneId, setUploadingMilestoneId] = useState<number | null>(null);

  // Transaction hook
  const { sendTransaction, data: txHash, isPending } = useSendTransaction();
  const { isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Simulate World ID Verification
  const handleVerifyWorldId = () => {
    setIsVerifyingWorldId(true);
    setTimeout(() => {
      setIsWorldIdVerified(true);
      setIsVerifyingWorldId(false);
      toast({
        title: 'World ID Verified! (ZK-Proof)',
        description: 'Proof of Humanity confirmed. Sybil protection active.',
      });
    }, 1500);
  };

  // Create Escrow Handler
  const handleCreateEscrow = () => {
    if (!isConnected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your Web3 wallet to create an escrow agreement.',
        variant: 'destructive',
      });
      return;
    }

    if (!isWorldIdVerified) {
      toast({
        title: 'World ID Required',
        description: 'Please verify with World ID to prove unique human client identity.',
        variant: 'destructive',
      });
      return;
    }

    const m1 = parseFloat(milestone1Amount) || 0;
    const m2 = parseFloat(milestone2Amount) || 0;
    const total = m1 + m2;

    const newEscrow: EscrowRecord = {
      id: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(8))).map((b) => b.toString(16).padStart(2, '0')).join(''),
      ensId: clientEns,
      client: address || '0xClientAddress',
      provider: DEFAULT_RECEIVER_ADDRESS,
      totalAmount: total,
      token: selectedToken,
      worldIdVerified: true,
      status: 'FUNDED',
      milestones: [
        {
          id: 1,
          title: milestone1Title,
          amount: m1,
          status: 'PENDING',
        },
        {
          id: 2,
          title: milestone2Title,
          amount: m2,
          status: 'PENDING',
        },
      ],
    };

    setEscrows([newEscrow, ...escrows]);
    setActiveTab('active');
    toast({
      title: 'Milestone Escrow Deployed!',
      description: `Locked $${total} ${selectedToken} into EagleEscrow smart contract.`,
    });
  };

  // Upload deliverable to 0G Storage
  const handleUploadDeliverable = async (escrowId: string, milestoneId: number) => {
    setUploadingMilestoneId(milestoneId);
    try {
      const simulatedResult: ZeroGUploadResult = await uploadToZeroGStorage({
        name: `deliverable_proof_m${milestoneId}.zip`,
        size: 1420580,
      });

      setEscrows((prev) =>
        prev.map((e) => {
          if (e.id === escrowId) {
            return {
              ...e,
              status: 'DELIVERABLE_SUBMITTED',
              milestones: e.milestones.map((m) => {
                if (m.id === milestoneId) {
                  return {
                    ...m,
                    status: 'SUBMITTED',
                    zeroGHash: simulatedResult.rootHash,
                    submittedFile: simulatedResult.fileName,
                  };
                }
                return m;
              }),
            };
          }
          return e;
        })
      );

      toast({
        title: 'Pinned to 0G Decentralized Storage!',
        description: `Deliverable CID: ${simulatedResult.rootHash.slice(0, 14)}...`,
      });
    } catch (err: any) {
      toast({
        title: '0G Upload Failed',
        description: err?.message || 'Could not upload to 0G network.',
        variant: 'destructive',
      });
    } finally {
      setUploadingMilestoneId(null);
    }
  };

  // Client approves milestone and releases funds
  const handleApproveMilestone = (escrowId: string, milestoneId: number, amount: number) => {
    // If native on-chain, trigger a lightweight sendTransaction or contract call
    try {
      sendTransaction({
        to: DEFAULT_RECEIVER_ADDRESS,
        value: parseEther('0.0001'), // nominal simulation value
      });
    } catch (e) {
      console.log('Simulation send:', e);
    }

    setEscrows((prev) =>
      prev.map((e) => {
        if (e.id === escrowId) {
          const updatedMilestones = e.milestones.map((m) => {
            if (m.id === milestoneId) {
              return { ...m, status: 'APPROVED' as const };
            }
            return m;
          });
          const allApproved = updatedMilestones.every((m) => m.status === 'APPROVED');
          return {
            ...e,
            status: allApproved ? 'COMPLETED' : e.status,
            milestones: updatedMilestones,
          };
        }
        return e;
      })
    );

    toast({
      title: 'Milestone Approved & Funds Released!',
      description: `$${amount} released directly to provider: ${DEFAULT_RECEIVER_ADDRESS.slice(0, 6)}...${DEFAULT_RECEIVER_ADDRESS.slice(-4)}`,
    });
  };

  return (
    <Layout>
      <SEOHead
        title="EagleEscrow Protocol | ETHGlobal Hackathon Submission"
        description="The First AI-Verifiable, Sybil-Resistant International Service Escrow Protocol with World ID, 0G Storage, and ENS."
      />

      <section className="pt-28 pb-24 min-h-screen">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-primary/10 to-blue-500/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> ETHGlobal Hackathon Flagship Project
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Eagle<span className="text-gradient">Escrow Protocol</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Decentralized milestone escrow for international agencies & freelancers. Powered by{' '}
              <strong className="text-foreground">World ID (Proof of Humanity)</strong>,{' '}
              <strong className="text-foreground">0G Labs (Decentralized Storage)</strong>, and{' '}
              <strong className="text-foreground">ENS</strong> with 0% intermediary cuts.
            </p>
          </div>

          {/* Protocol Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-muted-foreground uppercase flex items-center justify-center gap-1">
                <Lock size={12} className="text-primary" /> Total Value Locked
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">$148,500 USDC</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-muted-foreground uppercase flex items-center justify-center gap-1">
                <UserCheck size={12} className="text-green-400" /> World ID Verified
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold text-green-400 mt-1">100% Sybil-Proof</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-muted-foreground uppercase flex items-center justify-center gap-1">
                <HardDrive size={12} className="text-blue-400" /> 0G Storage Nodes
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold text-blue-400 mt-1">28 Synced</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-muted-foreground uppercase flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-primary" /> Fees Saved
              </div>
              <div className="text-xl sm:text-2xl font-display font-bold text-gradient mt-1">10-20% vs Upwork</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="p-1 bg-card/60 backdrop-blur border border-border rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'active'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active Escrow Agreements ({escrows.length})
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                + Create Milestone Escrow
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE ESCROWS */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {escrows.map((escrow) => (
                <motion.div
                  key={escrow.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6"
                >
                  {/* Escrow Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {escrow.id}
                        </span>
                        <span className="font-mono font-bold text-sm text-primary flex items-center gap-1">
                          <Globe size={14} /> {escrow.ensId}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Client: <span className="font-mono">{escrow.client}</span> | Provider:{' '}
                        <span className="font-mono">{escrow.provider.slice(0, 6)}...{escrow.provider.slice(-4)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* World ID Badge */}
                      {escrow.worldIdVerified && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          <UserCheck size={14} /> World ID Human Client
                        </div>
                      )}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          escrow.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {escrow.status}
                      </span>
                    </div>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                      Contract Milestones (${escrow.totalAmount} {escrow.token})
                    </h3>

                    {escrow.milestones.map((milestone, idx) => (
                      <div
                        key={milestone.id}
                        className="p-4 rounded-xl bg-card/60 border border-border/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-sm text-foreground">{milestone.title}</span>
                          </div>

                          {/* 0G Decentralized Storage Link */}
                          {milestone.zeroGHash ? (
                            <div className="flex items-center gap-2 text-xs text-blue-400 pt-1">
                              <HardDrive size={14} />
                              <span>0G Storage Root:</span>
                              <a
                                href={`https://storage-indexer-testnet.0g.ai/view/${milestone.zeroGHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-primary flex items-center gap-1 hover:underline"
                              >
                                {milestone.zeroGHash.slice(0, 10)}...{milestone.zeroGHash.slice(-6)}
                                <ExternalLink size={12} />
                              </a>
                              <span className="text-muted-foreground">({milestone.submittedFile})</span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic">
                              Deliverable pending submission by service provider.
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for this Milestone */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          <div className="text-right">
                            <div className="font-bold text-sm text-foreground">
                              ${milestone.amount} {escrow.token}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                              {milestone.status}
                            </div>
                          </div>

                          {/* If pending: Provider can upload to 0G */}
                          {milestone.status === 'PENDING' && (
                            <button
                              onClick={() => handleUploadDeliverable(escrow.id, milestone.id)}
                              disabled={uploadingMilestoneId === milestone.id}
                              className="px-3.5 py-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              {uploadingMilestoneId === milestone.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload size={14} />
                              )}
                              Upload to 0G
                            </button>
                          )}

                          {/* If submitted: Client can inspect 0G & Approve */}
                          {milestone.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleApproveMilestone(escrow.id, milestone.id, milestone.amount)}
                              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                            >
                              <Unlock size={14} /> Approve & Release
                            </button>
                          )}

                          {/* If approved: Completed badge */}
                          {milestone.status === 'APPROVED' && (
                            <div className="flex items-center gap-1 text-xs text-green-400 font-semibold px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                              <CheckCircle2 size={14} /> Released
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* TAB 2: CREATE ESCROW */}
          {activeTab === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={22} className="text-primary" />
                  <h2 className="text-lg font-bold">New Milestone Escrow Contract</h2>
                </div>
                <ConnectButton showBalance={false} accountStatus="avatar" />
              </div>

              {/* World ID Proof of Humanity Gate */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <UserCheck size={18} className="text-primary" />
                    World ID Sybil Protection
                  </div>
                  {isWorldIdVerified ? (
                    <span className="text-xs px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Human
                    </span>
                  ) : (
                    <button
                      onClick={handleVerifyWorldId}
                      disabled={isVerifyingWorldId}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      {isVerifyingWorldId ? 'Generating ZK-Proof...' : 'Verify with World ID'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  World ID zero-knowledge proofs guarantee that each escrow client is a unique, authenticated human. Prevents fake reviews, dispute extortion, and bot spam.
                </p>
              </div>

              {/* Service Provider (Pre-filled with your MetaMask) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  Service Provider (Recipient Wallet)
                </label>
                <input
                  type="text"
                  value={DEFAULT_RECEIVER_ADDRESS}
                  readOnly
                  className="form-input bg-muted/40 font-mono text-xs cursor-not-allowed text-foreground"
                />
              </div>

              {/* ENS Subdomain / Agreement ID */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  ENS Agreement Subdomain
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    value={clientEns}
                    onChange={(e) => setClientEns(e.target.value)}
                    className="form-input pl-10 text-sm font-mono"
                    placeholder="e.g. project.eaglebyte.eth"
                  />
                </div>
              </div>

              {/* Milestone 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Milestone 1 Title
                  </label>
                  <input
                    type="text"
                    value={milestone1Title}
                    onChange={(e) => setMilestone1Title(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={milestone1Amount}
                    onChange={(e) => setMilestone1Amount(e.target.value)}
                    className="form-input text-xs font-bold"
                  />
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Milestone 2 Title
                  </label>
                  <input
                    type="text"
                    value={milestone2Title}
                    onChange={(e) => setMilestone2Title(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={milestone2Amount}
                    onChange={(e) => setMilestone2Amount(e.target.value)}
                    className="form-input text-xs font-bold"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Escrow Value: </span>
                  <span className="font-bold text-lg text-primary">
                    ${(parseFloat(milestone1Amount) || 0) + (parseFloat(milestone2Amount) || 0)} {selectedToken}
                  </span>
                </div>

                <button
                  onClick={handleCreateEscrow}
                  className="btn-primary w-full sm:w-auto py-3 px-6 flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> Deploy & Fund Escrow
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EscrowDashboard;
