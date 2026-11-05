import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Video,
  ShieldCheck,
  HardDrive,
  Globe,
  Coins,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  Award,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Scene {
  id: number;
  duration: number; // in seconds
  title: string;
  subtitle: string;
  badge: string;
  narration: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    duration: 32,
    title: 'The $50 Billion Cross-Border Dilemma',
    subtitle: 'High Fees, Trust Deficits & Banking Inefficiencies in Global Freelancing',
    badge: 'PROBLEM & OPPORTUNITY',
    narration:
      'Every year, cross-border digital services represent over fifty billion dollars in global commerce. Yet international developers and clients face severe friction: centralized platforms take up to twenty percent commissions, banks drain five percent in forex spreads, transfers take days, and both sides risk chargebacks and fake identity fraud.',
  },
  {
    id: 2,
    duration: 35,
    title: 'Sybil-Proof Identity with World ID',
    subtitle: 'Zero-Knowledge Proof of Humanity to Eliminate Synthetic Fraud & Bots',
    badge: 'BOUNTY: BEST USE OF WORLD ID',
    narration:
      'EagleEscrow solves this with World ID. Before any high-value escrow is created, clients verify their unique human identity using ZK-SNARK proofs. Our smart contract verifies this on-chain, storing nullifiers to prevent replay attacks without revealing any personal private data.',
  },
  {
    id: 3,
    duration: 36,
    title: 'Verifiable Deliverables on 0G Labs Storage',
    subtitle: 'Tamper-Proof Proof of Delivery Pinned Directly to Decentralized Storage',
    badge: 'BOUNTY: BEST USE OF 0G LABS',
    narration:
      'When milestones are completed, deliverables — code commits, design zips, and audits — are pinned directly to 0G Labs Decentralized Storage. An immutable cryptographic root hash is anchored into the smart contract, giving clients and providers an irrefutable, permanent proof of delivery.',
  },
  {
    id: 4,
    duration: 35,
    title: 'Instant Multi-Chain EVM Settlement',
    subtitle: 'Sub-Cent Gas Fees Across Arbitrum, Polygon, and Base with 0% Platform Cuts',
    badge: 'BOUNTY: BEST MULTI-CHAIN ARCHITECTURE',
    narration:
      'Once the client inspects the 0G deliverable, they approve the milestone in one click. Funds automatically transfer directly from the contract vault to the service provider. Settling across Arbitrum, Polygon, and Base takes less than two seconds for under one cent in gas, completely eliminating traditional payment friction.',
  },
  {
    id: 5,
    duration: 32,
    title: 'Decentralized Invoicing & ETHGlobal Architecture',
    subtitle: 'ENS Subdomains, Autonomous State Machine & Open Source Web3 Rails',
    badge: 'ETHGLOBAL SUBMISSION',
    narration:
      'With ENS human-readable invoice subdomains, decentralized dispute states, and verified Solidity contracts, EagleEscrow turns trustless global commerce into reality. All smart contracts and code are fully open-source. Thank you judges, we invite you to test EagleEscrow live today!',
  },
];

export default function DemoVideo() {
  const { toast } = useToast();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = SCENES[currentSceneIndex];
  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  // Calculate overall timeline progress
  const elapsedBeforeCurrent = SCENES.slice(0, currentSceneIndex).reduce(
    (acc, s) => acc + s.duration,
    0
  );
  const overallProgress =
    ((elapsedBeforeCurrent + (sceneProgress / 100) * currentScene.duration) /
      totalDuration) *
    100;

  // Speak narration using Web Speech API
  const speakSceneNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!isMuted) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        // Try selecting an English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))
        );
        if (englishVoice) utterance.voice = englishVoice;
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Play / Pause handler
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
    } else {
      setIsPlaying(true);
      speakSceneNarration(currentScene.narration);
    }
  };

  // Switch scene
  const goToScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSceneProgress(0);
    if (isPlaying) {
      speakSceneNarration(SCENES[index].narration);
    }
  };

  // Timer loop for active scene
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const increment = (intervalMs / (currentScene.duration * 1000)) * 100;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev + increment >= 100) {
          // Transition to next scene
          if (currentSceneIndex < SCENES.length - 1) {
            setCurrentSceneIndex((c) => c + 1);
            speakSceneNarration(SCENES[currentSceneIndex + 1].narration);
            return 0;
          } else {
            // Finished full presentation
            setIsPlaying(false);
            window.speechSynthesis?.cancel();
            if (isRecording) {
              stopRecording();
            }
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScene.duration, isRecording]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast({ title: 'Fullscreen error', description: err.message, variant: 'destructive' });
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Start 4K Screen Recording
  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          frameRate: 60,
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
        audio: true,
      });

      streamRef.current = displayStream;
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(displayStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EagleEscrow_ETHGlobal_4K_Demo_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: '4K Video Downloaded!',
          description: 'Your demonstration video has been successfully saved to your computer.',
        });
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Reset and auto-play from Scene 1
      setCurrentSceneIndex(0);
      setSceneProgress(0);
      setIsPlaying(true);
      speakSceneNarration(SCENES[0].narration);

      toast({
        title: 'Recording Started in 4K',
        description: 'Auto-playing demo video. Video will auto-download upon completion.',
      });
    } catch (err: any) {
      toast({
        title: 'Recording Cancelled / Error',
        description: err.message || 'Screen capture permission was not granted.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between font-sans relative overflow-hidden select-none"
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl">🦅</span>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                EAGLE ESCROW
              </span>
              <span className="block text-[11px] text-gray-400 uppercase tracking-widest font-mono">
                ETHGlobal Demonstration Kit • 4K UHD
              </span>
            </div>
          </Link>
          <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {currentScene.badge}
          </span>
        </div>

        {/* Global Timeline Status */}
        <div className="hidden md:flex items-center gap-3 text-sm font-mono text-gray-300">
          <span>Scene {currentSceneIndex + 1} / {SCENES.length}</span>
          <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-200"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span>
            {Math.floor(
              (elapsedBeforeCurrent + (sceneProgress / 100) * currentScene.duration)
            )}
            s / {totalDuration}s
          </span>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
            >
              <Video className="w-4 h-4 animate-pulse" />
              <span>Record & Export 4K Video</span>
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce"
            >
              <Download className="w-4 h-4" />
              <span>Stop & Save Video</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="border-white/20 hover:bg-white/10 text-white"
            title="Fullscreen 4K"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Link to="/escrow">
            <Button
              variant="outline"
              className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 text-xs"
            >
              Open Live App
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Presentation Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-10 py-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentSceneIndex === 0 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold mb-6">
                <TrendingDown className="w-4 h-4" /> The International Service Friction ($50B Market)
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Global Commerce is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">Broken</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Centralized agencies and banks exploit independent builders and cross-border businesses with punitive commissions and multi-day clearance times.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-red-500/20 backdrop-blur-xl hover:border-red-500/40 transition-all">
                  <div className="text-3xl font-black text-red-400 mb-2">10% – 20%</div>
                  <h3 className="text-lg font-bold text-white mb-2">Platform Extortion</h3>
                  <p className="text-sm text-gray-400">
                    Upwork & Fiverr extract billions from creators with no verifiable deliverable guarantees.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-orange-500/20 backdrop-blur-xl hover:border-orange-500/40 transition-all">
                  <div className="text-3xl font-black text-orange-400 mb-2">3 to 5 Days</div>
                  <h3 className="text-lg font-bold text-white mb-2">Banking Clearance</h3>
                  <p className="text-sm text-gray-400">
                    SWIFT and PayPal drain 4%–6% in hidden FX conversion rates, freezing cash flows.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-yellow-500/20 backdrop-blur-xl hover:border-yellow-500/40 transition-all">
                  <div className="text-3xl font-black text-yellow-400 mb-2">Chargeback Fraud</div>
                  <h3 className="text-lg font-bold text-white mb-2">Sybil & Bot Fraud</h3>
                  <p className="text-sm text-gray-400">
                    Throwaway accounts initiate malicious disputes after services are fully delivered.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentSceneIndex === 1 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Proof of Humanity • Sybil Resistance
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Verified with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">World ID</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Zero-Knowledge cryptographic proofs verify that every client is an authenticated unique human before locking funds.
              </p>

              <div className="p-8 rounded-3xl bg-black/60 border border-purple-500/30 backdrop-blur-2xl shadow-2xl text-left max-w-3xl mx-auto">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-2xl">
                      🌐
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">World ID ZK Verification Protocol</h4>
                      <p className="text-xs text-gray-400 font-mono">IWorldID.verifyProof(root, groupId, nullifierHash)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED HUMAN
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 font-mono text-xs text-gray-300">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-gray-500 block mb-1">Nullifier Hash (Anti-Replay)</span>
                    <span className="text-purple-300 truncate block">0x92f81c4e7029ab1145...</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-gray-500 block mb-1">Privacy Guarantee</span>
                    <span className="text-emerald-300 block">100% Zero-Knowledge Proof</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentSceneIndex === 2 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6">
                <HardDrive className="w-4 h-4 text-blue-400" /> Decentralized Data Availability
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Verifiable Deliverables on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">0G Labs Storage</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Milestone codebases, design assets, and security audits are pinned permanently to 0G Decentralized Storage with on-chain cryptographic root hashes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-blue-500/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase">Milestone Deliverable</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] bg-blue-500/20 text-blue-300">0G INDEXER</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-2">eaglebyte_frontend_release.zip</div>
                  <p className="text-xs text-gray-400 font-mono mb-4">Size: 1.42 MB • Encrypted SHA-256 Checksum</p>
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-300 truncate">
                    Root Hash: 0x7b1c4e90812df934acb2011938fe729a
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-cyan-500/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">On-Chain Smart Contract Hook</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] bg-cyan-500/20 text-cyan-300">IMMUTABLE</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-2">submitMilestoneDeliverable()</div>
                  <p className="text-xs text-gray-400 mb-4">
                    Contract automatically seals deliverable status into state, preventing post-facto alterations during arbitration.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Verified on 0G Testnet Explorer
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentSceneIndex === 3 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-6">
                <Zap className="w-4 h-4 text-emerald-400" /> Multi-Chain Settlement Rails
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Instant Release • <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">&lt; $0.01 Gas</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Deploying across Ethereum Layer-2s and sidechains guarantees immediate payment release without international banking delays.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                {[
                  { name: 'Arbitrum One', speed: '0.8s', fee: '< $0.005', color: 'from-blue-600/30 to-blue-900/30' },
                  { name: 'Polygon', speed: '2.1s', fee: '< $0.008', color: 'from-purple-600/30 to-purple-900/30' },
                  { name: 'Base', speed: '1.2s', fee: '< $0.004', color: 'from-cyan-600/30 to-cyan-900/30' },
                  { name: 'Optimism', speed: '1.5s', fee: '< $0.006', color: 'from-red-600/30 to-red-900/30' },
                ].map((chain) => (
                  <div
                    key={chain.name}
                    className={`p-5 rounded-2xl bg-gradient-to-b ${chain.color} border border-white/10 backdrop-blur-xl`}
                  >
                    <div className="text-sm font-bold text-white mb-1">{chain.name}</div>
                    <div className="text-2xl font-black text-emerald-300 mb-2">{chain.fee}</div>
                    <div className="text-xs text-gray-400 font-mono">Finality: {chain.speed}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentSceneIndex === 4 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-6">
                <Award className="w-4 h-4 text-pink-400" /> ETHGlobal Hackathon Submission
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Trustless B2B Commerce</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                A non-custodial milestone protocol eliminating middleman exploitation for the global digital workforce.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left mb-8">
                <div className="p-4 rounded-xl bg-white/[0.04] border border-purple-500/30">
                  <span className="text-xs text-purple-400 font-bold block mb-1">WORLD ID</span>
                  <p className="text-sm font-bold text-white">Proof of Humanity</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-blue-500/30">
                  <span className="text-xs text-blue-400 font-bold block mb-1">0G LABS</span>
                  <p className="text-sm font-bold text-white">Decentralized Storage</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-cyan-500/30">
                  <span className="text-xs text-cyan-400 font-bold block mb-1">ENS</span>
                  <p className="text-sm font-bold text-white">Decentralized Invoicing</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-emerald-500/30">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">MULTI-CHAIN</span>
                  <p className="text-sm font-bold text-white">Sub-Cent Settlement</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-3">
                <Link to="/escrow">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-xl shadow-purple-600/30">
                    Launch Live Escrow dApp <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pay">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl">
                    Open Web3 Pay Portal
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtitles Banner */}
      <div className="relative z-20 px-8 py-3 bg-black/80 backdrop-blur-md border-t border-white/10 text-center">
        <p className="text-sm md:text-base text-gray-200 max-w-4xl mx-auto italic font-medium">
          "{currentScene.narration}"
        </p>
      </div>

      {/* Bottom Control Bar */}
      <footer className="relative z-20 flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-[#0a0d14] border-t border-white/10 gap-4">
        {/* Play/Pause & Audio */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/40"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToScene(0)}
            className="text-gray-400 hover:text-white"
            title="Restart Presentation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) window.speechSynthesis?.cancel();
            }}
            className="text-gray-400 hover:text-white"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Scene Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => goToScene(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                idx === currentSceneIndex
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white'
              }`}
            >
              {scene.id}. {scene.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Scene Progress Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span>Scene: {Math.round(sceneProgress)}%</span>
          <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-100"
              style={{ width: `${sceneProgress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
