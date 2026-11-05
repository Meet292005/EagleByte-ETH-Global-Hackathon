import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useBalance,
  useReadContract,
  useWriteContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits, isAddress } from 'viem';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import {
  DEFAULT_RECEIVER_ADDRESS,
  DEFAULT_RECEIVER_ENS,
  SUPPORTED_TOKENS,
  ERC20_ABI,
  TokenInfo,
} from '@/lib/web3Config';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Wallet,
  ArrowRight,
  TrendingDown,
  Copy,
  Check,
  Sparkles,
  Globe,
  AlertCircle,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Block explorer base URLs
const EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  421614: 'https://sepolia.arbiscan.io',
  84532: 'https://sepolia.basescan.org',
  137: 'https://polygonscan.com',
  42161: 'https://arbiscan.io',
  8453: 'https://basescan.org',
  10: 'https://optimistic.etherscan.io',
};

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Ethereum Sepolia',
  421614: 'Arbitrum Sepolia',
  84532: 'Base Sepolia',
  137: 'Polygon',
  42161: 'Arbitrum One',
  8453: 'Base',
  10: 'Optimism',
};

// Estimated USD -> INR exchange rate
const USD_INR_RATE = 86.8;

const Web3Pay = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // URL Query Parameters (allows sending custom payment links like /pay?amount=500&invoice=EB-101)
  const initialAmount = searchParams.get('amount') || '100';
  const initialInvoice = searchParams.get('invoice') || `EB-${Math.floor(1000 + Math.random() * 9000)}`;
  const initialDesc = searchParams.get('desc') || 'Digital Development Services';

  const [usdAmount, setUsdAmount] = useState<string>(initialAmount);
  const [invoiceNumber] = useState<string>(initialInvoice);
  const [serviceDescription, setServiceDescription] = useState<string>(initialDesc);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('USDC');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Wagmi Hooks
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Selected token details
  const selectedToken: TokenInfo = useMemo(() => {
    return (
      SUPPORTED_TOKENS.find((t) => t.symbol === selectedTokenSymbol) ||
      SUPPORTED_TOKENS[0]
    );
  }, [selectedTokenSymbol]);

  // Token address on current chain
  const tokenContractAddress = useMemo(() => {
    if (selectedToken.isNative) return undefined;
    return selectedToken.addressMap[chainId];
  }, [selectedToken, chainId]);

  // Read ERC-20 balance if applicable
  const { data: erc20BalanceRaw, refetch: refetchTokenBalance } = useReadContract({
    address: tokenContractAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !selectedToken.isNative && !!tokenContractAddress,
    },
  });

  // Read Native Balance (ETH / POL)
  const { data: nativeBalanceData } = useBalance({
    address,
    query: {
      enabled: isConnected && !!address && !!selectedToken.isNative,
    },
  });

  // Calculate formatted user balance
  const userBalanceFormatted = useMemo(() => {
    if (!isConnected) return '0.00';
    if (selectedToken.isNative) {
      return nativeBalanceData ? Number(formatUnits(nativeBalanceData.value, 18)).toFixed(4) : '0.00';
    }
    if (erc20BalanceRaw !== undefined) {
      return Number(formatUnits(erc20BalanceRaw as bigint, selectedToken.decimals)).toFixed(2);
    }
    return '0.00';
  }, [isConnected, selectedToken, nativeBalanceData, erc20BalanceRaw]);

  // Calculated required crypto amount (USDC/USDT = 1:1 with USD)
  const requiredCryptoAmount = useMemo(() => {
    const parsedUsd = parseFloat(usdAmount) || 0;
    if (selectedToken.symbol === 'USDC' || selectedToken.symbol === 'USDT') {
      return parsedUsd.toFixed(2);
    }
    if (selectedToken.symbol === 'ETH') {
      // Approximate ETH price for quick estimate (e.g. $3,400)
      return (parsedUsd / 3400).toFixed(4);
    }
    if (selectedToken.symbol === 'POL') {
      return (parsedUsd / 0.55).toFixed(2);
    }
    return parsedUsd.toFixed(2);
  }, [usdAmount, selectedToken]);

  // Fee calculation vs traditional PayPal/Stripe (saves ~4-5%)
  const numericUsd = parseFloat(usdAmount) || 0;
  const inrTotal = (numericUsd * USD_INR_RATE).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  const paypalFeeUsd = (numericUsd * 0.045 + 0.3).toFixed(2);
  const web3FeeUsd = '< $0.01';
  const savedInr = ((parseFloat(paypalFeeUsd) + numericUsd * 0.02) * USD_INR_RATE).toLocaleString(
    'en-IN',
    { maximumFractionDigits: 0 }
  );

  // Wagmi Write Contract for ERC-20 Transfer
  const {
    writeContract,
    data: erc20TxHash,
    isPending: isErc20Pending,
    error: erc20Error,
    reset: resetErc20,
  } = useWriteContract();

  // Wagmi Send Transaction for Native Token (ETH / POL)
  const {
    sendTransaction,
    data: nativeTxHash,
    isPending: isNativePending,
    error: nativeError,
    reset: resetNative,
  } = useSendTransaction();

  const activeTxHash = erc20TxHash || nativeTxHash;

  // Wait for receipt
  const { isLoading: isTxWaiting, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: activeTxHash,
  });

  const isPaying = isErc20Pending || isNativePending || isTxWaiting;

  // Handle Pay Action
  const handlePay = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your Web3 wallet first using the button above.',
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(requiredCryptoAmount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to pay.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedToken.isNative) {
        // Native ETH / POL Transfer
        const valueInWei = parseUnits(requiredCryptoAmount, 18);
        sendTransaction({
          to: DEFAULT_RECEIVER_ADDRESS,
          value: valueInWei,
        });
      } else {
        // ERC-20 (USDC / USDT) Transfer
        if (!tokenContractAddress) {
          toast({
            title: 'Unsupported Token on this Network',
            description: `${selectedToken.symbol} is not deployed on ${CHAIN_NAMES[chainId] || 'this chain'}. Please switch network or select another token.`,
            variant: 'destructive',
          });
          return;
        }

        const valueInUnits = parseUnits(requiredCryptoAmount, selectedToken.decimals);
        writeContract({
          address: tokenContractAddress,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [DEFAULT_RECEIVER_ADDRESS, valueInUnits],
        });
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment Error',
        description: err?.message || 'Could not initiate transaction.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyReceiver = () => {
    navigator.clipboard.writeText(DEFAULT_RECEIVER_ADDRESS);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
    toast({
      title: 'Address Copied',
      description: 'Receiver wallet address copied to clipboard.',
    });
  };

  const handleReset = () => {
    resetErc20();
    resetNative();
  };

  return (
    <Layout>
      <SEOHead
        title="Web3 International Payment Portal | Eagle Byte"
        description="Fast, zero-forex-loss international payments with USDC, USDT, and crypto for Eagle Byte clients."
      />

      <section className="pt-28 pb-20 min-h-screen">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Globe size={14} /> International Borderless Rail
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Pay Invoice via <span className="text-gradient">Web3</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Send payments in stablecoins (<strong className="text-foreground">USDC / USDT</strong>) or crypto. Enjoy{' '}
              <span className="text-primary font-semibold">sub-cent network fees</span>, instant settlement, and zero banking conversion fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Payment Form & Execution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-white/10"
            >
              {isTxConfirmed ? (
                /* Success Confirmation View */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-foreground mb-1">
                      Payment Successful!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Transaction has been verified on the blockchain.
                    </p>
                  </div>

                  {/* Receipt Box */}
                  <div className="bg-card/70 border border-border rounded-xl p-4 text-left text-xs space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice:</span>
                      <span className="font-mono font-bold">{invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">
                        ${usdAmount} USD ({requiredCryptoAmount} {selectedToken.symbol})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span>{CHAIN_NAMES[chainId] || `Chain #${chainId}`}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/60">
                      <span className="text-muted-foreground">Tx Hash:</span>
                      {activeTxHash && (
                        <a
                          href={`${EXPLORER_URLS[chainId] || 'https://etherscan.io'}/tx/${activeTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary flex items-center gap-1 hover:underline"
                        >
                          {activeTxHash.slice(0, 8)}...{activeTxHash.slice(-6)}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={handleReset}
                      className="btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                      <RotateCcw size={16} /> Pay Another Invoice
                    </button>
                    <Link
                      to="/"
                      className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted/50 transition-colors"
                    >
                      Return Home
                    </Link>
                  </div>
                </div>
              ) : (
                /* Payment Input Form */
                <div className="space-y-6">
                  {/* Wallet Connection Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet size={18} className="text-primary" />
                      <span className="font-medium">Web3 Wallet</span>
                    </div>
                    <ConnectButton showBalance={false} accountStatus="avatar" />
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                        Invoice / Reference #
                      </label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        readOnly
                        className="form-input bg-muted/40 font-mono text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                        Service Description
                      </label>
                      <input
                        type="text"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="e.g. Web Development"
                        className="form-input text-sm"
                      />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                      Amount in USD ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={usdAmount}
                        onChange={(e) => setUsdAmount(e.target.value)}
                        placeholder="100.00"
                        className="form-input pl-8 text-lg font-bold"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 bg-muted rounded text-muted-foreground">
                        ≈ ₹{inrTotal} INR
                      </span>
                    </div>
                  </div>

                  {/* Token Selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                      Select Payment Token
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUPPORTED_TOKENS.map((token) => {
                        const isSelected = selectedTokenSymbol === token.symbol;
                        return (
                          <button
                            key={token.symbol}
                            type="button"
                            onClick={() => setSelectedTokenSymbol(token.symbol)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                                : 'border-border/80 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground'
                            }`}
                          >
                            <div className="text-sm font-semibold">{token.symbol}</div>
                            <div className="text-[10px] opacity-75 truncate">{token.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Balance & Network Hint */}
                  {isConnected && (
                    <div className="flex items-center justify-between text-xs px-3 py-2 bg-muted/40 rounded-lg">
                      <span className="text-muted-foreground">
                        Your {selectedToken.symbol} Balance:
                      </span>
                      <span className="font-mono font-semibold">
                        {userBalanceFormatted} {selectedToken.symbol}
                      </span>
                    </div>
                  )}

                  {/* Unsupported Token Warning */}
                  {!selectedToken.isNative && !tokenContractAddress && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        {selectedToken.symbol} is not configured on {CHAIN_NAMES[chainId] || 'this chain'}. Please switch network in your wallet to Polygon, Arbitrum, or Base.
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying || (!selectedToken.isNative && !tokenContractAddress)}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-lg neon-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Confirming on Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {requiredCryptoAmount} {selectedToken.symbol}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Right: Receiver Info & Savings Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Receiver Card (Direct Address & optional ENS) */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <h3 className="font-display font-semibold text-base">Verified Merchant Identity</h3>
                </div>

                <div className="p-3.5 rounded-xl bg-card/70 border border-border space-y-2.5">
                  {DEFAULT_RECEIVER_ENS ? (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">ENS Domain:</span>
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono font-bold">
                        {DEFAULT_RECEIVER_ENS}
                      </span>
                    </div>
                  ) : null}
                  <div className="text-xs text-muted-foreground space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span>MetaMask Receiver:</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-semibold border border-green-500/20">
                        Direct Deposit
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="font-mono text-foreground text-[11px] truncate select-all">
                        {DEFAULT_RECEIVER_ADDRESS}
                      </span>
                      <button
                        onClick={handleCopyReceiver}
                        className="text-muted-foreground hover:text-primary p-1 rounded transition-colors shrink-0"
                        title="Copy full address"
                      >
                        {copiedAddress ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  International clients can send payments directly from any EVM wallet (MetaMask, Trust, Coinbase, etc.). Funds land directly in your personal MetaMask wallet with zero chargebacks.
                </p>
              </div>

              {/* Fee Comparison / Savings Box */}
              <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingDown size={20} />
                  <h3 className="font-display font-semibold text-base">Why Pay via Web3?</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                    <span className="font-medium">Web3 (Polygon / L2):</span>
                    <span className="font-bold">{web3FeeUsd} gas fee (Instant)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    <span className="font-medium">PayPal / SWIFT:</span>
                    <span className="font-bold">~${paypalFeeUsd} fee + 3-5 days</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 text-center">
                  <div className="text-xs text-muted-foreground">Estimated Savings on this Invoice:</div>
                  <div className="text-lg font-display font-bold text-gradient mt-0.5">
                    ≈ ₹{savedInr} INR
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Web3Pay;
