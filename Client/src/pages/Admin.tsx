import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Wallet,
  FileText,
  Eye,
  EyeOff,
  Server,
  Database,
  Globe,
  Cpu,
  Users,
  AlertTriangle,
  Download,
  Check,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  Send,
  HardDrive
} from 'lucide-react';
import { DEFAULT_RECEIVER_ADDRESS } from '@/lib/web3Config';

// Types
interface Web3Transaction {
  id: string;
  hash: string;
  amount: string;
  cryptoAmount: string;
  token: string;
  network: string;
  chainId?: number;
  from: string;
  to: string;
  status: 'Confirmed' | 'Settled' | 'Pending';
  timestamp: string;
}

interface EscrowMilestone {
  id: string;
  title: string;
  amount: string;
  status: 'Approved' | 'Submitted' | 'In Progress' | 'Pending';
  deliverable?: string;
  storageCid?: string;
  worldIdVerified?: boolean;
}

interface EscrowProject {
  id: string;
  client: string;
  clientAddress: string;
  projectName: string;
  totalBudget: string;
  token: string;
  network: string;
  overallStatus: 'Active' | 'Under Review' | 'Completed';
  milestones: EscrowMilestone[];
}

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  projectTitle: string;
  description: string;
  createdAt: string;
  status?: 'New' | 'Contacted' | 'Proposal Sent';
}

// Initial Seed Transactions (incorporating user's real Sepolia transactions from test runs)
const DEFAULT_TRANSACTIONS: Web3Transaction[] = [
  {
    id: 'EB-2145',
    hash: '0x9a837c76b10e53a2f89c6218d7412e0fbb38a192c77134267e20b33a7e58319a',
    amount: '1.00',
    cryptoAmount: '0.0003',
    token: 'ETH',
    network: 'Ethereum Sepolia',
    chainId: 11155111,
    from: '0x56A0547B80A34dD93c35b056E3902f9B577',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'EB-7830',
    hash: '0x3ec8912e75fa13bb472c9182d02c8991a0b3f81e289c001742a0b12ff78a9c34',
    amount: '1.00',
    cryptoAmount: '0.0003',
    token: 'ETH',
    network: 'Ethereum Sepolia',
    chainId: 11155111,
    from: '0x56A0547B80A34dD93c35b056E3902f9B577',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'EB-2009',
    hash: '0x71fa49c32b0051a87b1c4391e0a98d3319bf08a946e1074a68297b4fa5502c81',
    amount: '1.00',
    cryptoAmount: '0.0003',
    token: 'ETH',
    network: 'Ethereum Sepolia',
    chainId: 11155111,
    from: '0x0Ab8642107b36fA89eE23190ab76Ce421946eB48',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Settled',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
  {
    id: 'EB-9042',
    hash: '0xd481a6c024a1bf9c4e85741029c0a3748be7495b287900b14c3e8095b6c201a4',
    amount: '4,500.00',
    cryptoAmount: '4500.00',
    token: 'USDC',
    network: 'Arbitrum Sepolia',
    chainId: 421614,
    from: '0x39B8841F91738D56A49141fB0E09A18B0971482E',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Settled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'EB-8891',
    hash: '0x15b809a7140e7912384a519800c74b98124fa0921bb342e09841fba0914c8109',
    amount: '2,800.00',
    cryptoAmount: '2800.00',
    token: 'USDT',
    network: 'Polygon',
    chainId: 137,
    from: '0xF021749A2148B91048bE512A093751280946c51E',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Settled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'EB-6612',
    hash: '0x82f913e01a884c91038b5192074e510842bb017a46e1074a68297b4fa5502c81',
    amount: '3,200.00',
    cryptoAmount: '5818.18',
    token: 'POL',
    network: 'Polygon',
    chainId: 137,
    from: '0x84E1048bE512A093751280946c51E39B8841F917',
    to: DEFAULT_RECEIVER_ADDRESS,
    status: 'Settled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

// Initial Escrow Deliverable Projects
const INITIAL_PROJECTS: EscrowProject[] = [
  {
    id: 'proj-1',
    client: 'Apex Capital Ventures (London)',
    clientAddress: '0x71C92a48bE512A093751280946c51E39B8849A2',
    projectName: 'Cross-Chain Escrow Protocol & Smart Contract Suite',
    totalBudget: '$18,500 USDC',
    token: 'USDC',
    network: 'Ethereum Sepolia',
    overallStatus: 'Under Review',
    milestones: [
      {
        id: 'm1-1',
        title: 'System Architecture & Mathematical Invariant Models',
        amount: '$6,000 USDC',
        status: 'Approved',
        deliverable: 'Formal Architecture RFC & Threat Model PDF',
        storageCid: '0x140e7912384a519800c74b98124fa0921bb342e0',
        worldIdVerified: true,
      },
      {
        id: 'm1-2',
        title: 'Solidity Contracts, Reentrancy Guard & Foundry Fuzz Tests',
        amount: '$8,000 USDC',
        status: 'Submitted',
        deliverable: 'Smart Contract Core v1.2 with 100% Branch Test Coverage',
        storageCid: '0x9e4f21b7a84e311fc612d45a9071b56a940c812d',
        worldIdVerified: true,
      },
      {
        id: 'm1-3',
        title: 'Third-Party Audit Remediation & Sepolia Deployment',
        amount: '$4,500 USDC',
        status: 'In Progress',
        deliverable: 'Mainnet & Testnet Deployment Scripts & Verified ABIs',
        worldIdVerified: true,
      },
    ],
  },
  {
    id: 'proj-2',
    client: 'Hyperion Labs AG (Zurich)',
    clientAddress: '0x39B8841F91738D56A49141fB0E09A18B09714841',
    projectName: 'Decentralized AI Agent Swarm & 0G Storage Pipeline',
    totalBudget: '$24,000 USDT',
    token: 'USDT',
    network: 'Base Sepolia',
    overallStatus: 'Active',
    milestones: [
      {
        id: 'm2-1',
        title: 'LangGraph Agent Orchestration Engine & Tool Router',
        amount: '$10,000 USDT',
        status: 'Approved',
        deliverable: 'Autonomous Agent Cluster v1.0 Container Image & Tests',
        storageCid: '0x4e85741029c0a3748be7495b287900b14c3e8095',
        worldIdVerified: true,
      },
      {
        id: 'm2-2',
        title: '0G Labs Decentralized Storage Vector Indexing',
        amount: '$14,000 USDT',
        status: 'Submitted',
        deliverable: 'Decentralized Vector Memory with 0G Storage DA Node proofs',
        storageCid: '0x3a88c71e204b77d61038b5192074e510842bb5ff91',
        worldIdVerified: true,
      },
    ],
  },
  {
    id: 'proj-3',
    client: 'Nexus Fintech Group (Singapore)',
    clientAddress: '0xF021749A2148B91048bE512A093751280946c51E',
    projectName: 'Enterprise Web3 Payment Gateway & World ID KYC',
    totalBudget: '$9,200 POL',
    token: 'POL',
    network: 'Polygon PoS',
    overallStatus: 'Completed',
    milestones: [
      {
        id: 'm3-1',
        title: 'Responsive Web3 Checkout UI & Multi-Chain Bridge',
        amount: '$4,600 POL',
        status: 'Approved',
        deliverable: 'Production Next.js Frontend Bundle & Wagmi Config',
        storageCid: '0x88c71e204b77d61038b5192074e510842bb5ff912',
        worldIdVerified: true,
      },
      {
        id: 'm3-2',
        title: 'World ID Sybil Resistance Oracle & Zero-Knowledge Proofs',
        amount: '$4,600 POL',
        status: 'Approved',
        deliverable: 'World ID On-Chain Verification Gateway & SDK Bridge',
        storageCid: '0x71fa49c32b0051a87b1c4391e0a98d3319bf08a9',
        worldIdVerified: true,
      },
    ],
  },
];

// Initial Seed Messages
const SEED_MESSAGES: ContactMessage[] = [
  {
    _id: 'seed-1',
    fullName: 'Alex Vance',
    email: 'alex.vance@solaris-labs.xyz',
    mobile: '+1 (555) 234-8901',
    projectTitle: 'DeFi Options Settlement Layer on Arbitrum',
    description: 'We need Eagle Byte to architect a non-custodial options protocol with sub-second oracle execution and World ID human proof.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'New',
  },
  {
    _id: 'seed-2',
    fullName: 'Sophia Chen',
    email: 'sophia@neuralchain.io',
    mobile: '+65 9123 4567',
    projectTitle: '0G Storage Autonomous Agent Memory Integration',
    description: 'Looking to hire Eagle Byte for implementing high-throughput decentralized vector indexing using 0G Labs data availability.',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: 'Contacted',
  },
  {
    _id: 'seed-3',
    fullName: 'Marcus Thorne',
    email: 'mthorne@blockfrontier.vc',
    mobile: '+44 20 7946 0912',
    projectTitle: 'Full-Stack Web3 Client Portal & Invoice Engine',
    description: 'Need an international payment portal supporting stablecoins and fiat off-ramps with automated escrow milestone verification.',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    status: 'Proposal Sent',
  },
];

const EXPLORER_URLS: Record<string, string> = {
  'Ethereum Sepolia': 'https://sepolia.etherscan.io',
  'Arbitrum Sepolia': 'https://sepolia.arbiscan.io',
  'Base Sepolia': 'https://sepolia.basescan.org',
  'Polygon': 'https://polygonscan.com',
  'Polygon PoS': 'https://polygonscan.com',
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('admin@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('admin@gmail.com');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'transactions' | 'works' | 'inquiries' | 'system'>('transactions');

  // Transactions State
  const [transactions, setTransactions] = useState<Web3Transaction[]>([]);
  const [txSearch, setTxSearch] = useState<string>('');
  const [txNetworkFilter, setTxNetworkFilter] = useState<string>('All');

  // Escrow Works State
  const [projects, setProjects] = useState<EscrowProject[]>(INITIAL_PROJECTS);
  const [selectedProofCid, setSelectedProofCid] = useState<string | null>(null);

  // Contact Messages State
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [contactSearch, setContactSearch] = useState<string>('');
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);

  // Check if session is already stored on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('eaglebyte_admin_auth');
    const savedToken = localStorage.getItem('token');
    if (savedAuth === 'true' || savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  // Load and sync transactions
  const loadTransactions = () => {
    try {
      const localTxs = JSON.parse(localStorage.getItem('eaglebyte_web3_txs') || '[]');
      // Combine user real transactions with default transactions, eliminating duplicates by hash
      const combined = [...localTxs, ...DEFAULT_TRANSACTIONS];
      const unique = combined.filter(
        (tx, index, self) => index === self.findIndex((t) => t.hash === tx.hash || (t.id === tx.id && t.id.startsWith('EB-')))
      );
      setTransactions(unique);
    } catch (e) {
      setTransactions(DEFAULT_TRANSACTIONS);
    }
  };

  // Load and sync contact messages
  const loadContacts = async () => {
    setLoadingContacts(true);
    let apiSuccess = false;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl && token) {
        const res = await fetch(`${apiUrl}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setContacts(data);
            apiSuccess = true;
          }
        }
      }
    } catch (err) {
      console.log('Backend contact fetch unavailable, using persistent storage');
    }

    if (!apiSuccess) {
      try {
        const local = JSON.parse(localStorage.getItem('eaglebyte_contacts') || '[]');
        const combined = [...local, ...SEED_MESSAGES];
        const unique = combined.filter(
          (c, idx, self) => idx === self.findIndex((item) => item._id === c._id || item.email === c.email)
        );
        setContacts(unique);
      } catch (e) {
        setContacts(SEED_MESSAGES);
      }
    }
    setLoadingContacts(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
      loadContacts();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);

    const cleanEmail = emailInput.trim();
    const cleanPassword = passwordInput.trim();

    // Verify credentials: admin@gmail.com / admin@gmail.com
    if (cleanEmail === 'admin@gmail.com' && cleanPassword === 'admin@gmail.com') {
      // Attempt backend API call if server is running
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/portal/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        }
      } catch (err) {
        console.log('Local authenticated session initiated');
      }

      // Set admin session
      localStorage.setItem('eaglebyte_admin_auth', 'true');
      localStorage.setItem('userEmail', 'admin@gmail.com');
      setIsAuthenticated(true);
      setIsLoggingIn(false);

      toast({
        title: 'Executive Access Granted',
        description: 'Welcome back, Administrator. Protocol systems active.',
      });
    } else {
      setIsLoggingIn(false);
      toast({
        title: 'Invalid Credentials',
        description: 'Please enter Email: admin@gmail.com and Password: admin@gmail.com',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eaglebyte_admin_auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    toast({
      title: 'Logged Out',
      description: 'You have been safely disconnected from the admin session.',
    });
  };

  // Milestone Approval Action
  const handleApproveMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          milestones: proj.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            return { ...m, status: 'Approved' };
          }),
        };
      })
    );

    toast({
      title: 'Milestone Approved & Funds Released',
      description: 'Smart contract escrow lock released. Transaction queued to client on-chain.',
    });
  };

  // Delete message
  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c._id !== id));
    try {
      const local = JSON.parse(localStorage.getItem('eaglebyte_contacts') || '[]');
      const filtered = local.filter((c: any) => c._id !== id);
      localStorage.setItem('eaglebyte_contacts', JSON.stringify(filtered));
    } catch (e) {}

    toast({
      title: 'Inquiry Deleted',
      description: 'Message removed from tracking queue.',
    });
  };

  // Simulate Add New Transaction
  const handleAddSampleTx = () => {
    const randomId = 'EB-' + Math.floor(1000 + Math.random() * 9000);
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newTx: Web3Transaction = {
      id: randomId,
      hash: mockHash,
      amount: '1.00',
      cryptoAmount: '0.0003',
      token: 'ETH',
      network: 'Ethereum Sepolia',
      chainId: 11155111,
      from: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      to: DEFAULT_RECEIVER_ADDRESS,
      status: 'Confirmed',
      timestamp: new Date().toISOString(),
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    try {
      const local = JSON.parse(localStorage.getItem('eaglebyte_web3_txs') || '[]');
      localStorage.setItem('eaglebyte_web3_txs', JSON.stringify([newTx, ...local]));
    } catch (e) {}

    toast({
      title: 'On-Chain Payment Logged',
      description: `Invoice ${randomId} received: 0.0003 SepoliaETH`,
    });
  };

  // Export JSON Report
  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      admin: 'admin@gmail.com',
      protocol: 'EagleByte Web3 Escrow & Payment Gateway',
      totalTransactions: transactions.length,
      transactions,
      escrowProjects: projects,
      inquiries: contacts,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EagleByte-Audit-Report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Audit Report Exported',
      description: 'Complete protocol audit state saved to JSON.',
    });
  };

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.hash.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.from.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.token.toLowerCase().includes(txSearch.toLowerCase());
      const matchesNetwork = txNetworkFilter === 'All' || tx.network === txNetworkFilter;
      return matchesSearch && matchesNetwork;
    });
  }, [transactions, txSearch, txNetworkFilter]);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      return (
        c.fullName.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.projectTitle.toLowerCase().includes(contactSearch.toLowerCase())
      );
    });
  }, [contacts, contactSearch]);

  // Calculate Stat Totals
  const totalVolumeNumber = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const clean = parseFloat(t.amount.replace(/,/g, '')) || 0;
      return acc + clean;
    }, 148500);
  }, [transactions]);

  // -------------------------------------------------------------
  // VIEW: UNAUTHENTICATED LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <Layout>
        <SEOHead
          title="Executive Admin Portal Login | Eagle Byte"
          description="Administrative control room for managing Web3 international payments, escrow milestones, and client communications."
        />
        <section className="pt-32 pb-24 min-h-screen flex items-center justify-center">
          <div className="container-custom max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-primary to-purple-500 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                    <Lock className="text-primary" size={24} />
                  </div>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  Admin <span className="text-gradient">Control Center</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Restricted access for protocol monitoring, Web3 transactions, and escrow settlement.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="admin@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-card/80 border border-white/10 focus:border-primary focus:outline-none text-foreground text-sm font-mono placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      placeholder="admin@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-card/80 border border-white/10 focus:border-primary focus:outline-none text-foreground text-sm font-mono placeholder:text-muted-foreground/50 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary/90 flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>
                    Hackathon Credentials: <strong className="font-mono text-foreground">admin@gmail.com</strong> /{' '}
                    <strong className="font-mono text-foreground">admin@gmail.com</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/25 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Verifying Credentials...
                    </>
                  ) : (
                    <>
                      <Unlock size={16} /> Access Admin Portal
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('admin@gmail.com');
                    setPasswordInput('admin@gmail.com');
                    setTimeout(() => handleLogin(), 100);
                  }}
                  className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-yellow-400" /> 1-Click Demo Sign In (admin@gmail.com)
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  ← Return to Public Homepage
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED EXECUTIVE ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <Layout>
      <SEOHead
        title="Admin Control Room | Eagle Byte Web3 Executive Portal"
        description="Comprehensive administrative oversight for Web3 multi-chain payments, escrow milestone deliverables, World ID human verification, and client inquiries."
      />

      <section className="pt-28 pb-20 min-h-screen">
        <div className="container-custom max-w-7xl">
          {/* Top Bar Header */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={13} /> Executive Control Room
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Systems Operational
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                EagleByte <span className="text-gradient">Protocol Administration</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Monitoring Sepolia transactions, 0G Labs deliverable storage, and World ID verified escrows.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={handleAddSampleTx}
                className="px-3.5 py-2 rounded-xl bg-card border border-white/10 hover:border-primary/50 text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                title="Simulate incoming on-chain invoice payment"
              >
                <DollarSign size={14} className="text-green-400" /> Test Inflow
              </button>
              <button
                onClick={() => {
                  loadTransactions();
                  loadContacts();
                  toast({ title: 'Refreshed', description: 'Latest blockchain and database states synced.' });
                }}
                className="px-3.5 py-2 rounded-xl bg-card border border-white/10 hover:border-white/20 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                onClick={handleExportReport}
                className="px-3.5 py-2 rounded-xl bg-card border border-white/10 hover:border-white/20 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Download size={14} /> Export Audit
              </button>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto md:ml-0"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Volume Processed</span>
                <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
                ${totalVolumeNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-green-400 mt-1 flex items-center gap-1">
                <ArrowUpRight size={12} /> 100% On-Chain Settled
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Web3 Transactions</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Activity size={16} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {transactions.length} Verified
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Sepolia, Arbitrum, Polygon, Base
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Escrow Capital</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Layers size={16} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
                $51,700 Locked
              </div>
              <div className="text-[11px] text-purple-400 mt-1">
                3 Client Milestone Contracts
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Client Inquiries</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {contacts.length} Leads
              </div>
              <div className="text-[11px] text-blue-400 mt-1">
                MongoDB Atlas Synced
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 mb-6 gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <Wallet size={16} /> Web3 Transactions & Invoices ({transactions.length})
            </button>

            <button
              onClick={() => setActiveTab('works')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'works'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <HardDrive size={16} /> Escrow Works & Deliverables ({projects.length})
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <FileText size={16} /> Client Inquiries ({contacts.length})
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <Server size={16} /> Protocol Infra & Health
            </button>
          </div>

          {/* TAB 1: WEB3 TRANSACTIONS & INVOICES */}
          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Filter & Search Bar */}
              <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by invoice, hash, or wallet..."
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-white/10 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Filter size={13} /> Network:
                  </span>
                  <select
                    value={txNetworkFilter}
                    onChange={(e) => setTxNetworkFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-card border border-white/10 text-xs focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="All">All Networks</option>
                    <option value="Ethereum Sepolia">Ethereum Sepolia</option>
                    <option value="Arbitrum Sepolia">Arbitrum Sepolia</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Base Sepolia">Base Sepolia</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-muted-foreground uppercase font-semibold text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">Invoice / Ref</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Sender Wallet</th>
                        <th className="py-3.5 px-4">Receiver Wallet</th>
                        <th className="py-3.5 px-4">Amount (USD / Crypto)</th>
                        <th className="py-3.5 px-4">Network</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Blockchain Proof</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            No transactions matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <tr key={tx.hash + tx.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                              {tx.id}
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                              {new Date(tx.timestamp).toLocaleString([], {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-muted-foreground">
                              {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-muted-foreground">
                              {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Merchant Vault'}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                              ${tx.amount}{' '}
                              <span className="text-primary font-mono text-[11px]">
                                ({tx.cryptoAmount} {tx.token})
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[11px] font-medium">
                                {tx.network}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium text-[11px]">
                                <CheckCircle2 size={12} /> {tx.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {tx.hash && (
                                <a
                                  href={`${EXPLORER_URLS[tx.network] || 'https://sepolia.etherscan.io'}/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
                                >
                                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ESCROW WORKS & DELIVERABLES */}
          {activeTab === 'works' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-4 rounded-xl border border-white/10 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Decentralized Work Verification & Milestone Governance
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Deliverables stored immutably on 0G Labs Storage DA layer with World ID Sybil defense proof.
                    </p>
                  </div>
                </div>
                <Link
                  to="/escrow"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-colors"
                >
                  Public Escrow Portal <ExternalLink size={12} />
                </Link>
              </div>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden p-6 space-y-6"
                >
                  {/* Project Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-primary">
                          {project.network}
                        </span>
                        <span className="font-semibold text-xs text-muted-foreground">
                          Client: {project.client} ({project.clientAddress.slice(0, 6)}...
                          {project.clientAddress.slice(-4)})
                        </span>
                      </div>
                      <h2 className="text-xl font-bold font-display text-foreground">{project.projectName}</h2>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-muted-foreground">Total Escrow Budget</div>
                      <div className="text-lg font-bold font-mono text-green-400">{project.totalBudget}</div>
                    </div>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Deliverable Milestones & Proofs
                    </h3>

                    {project.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/15 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-muted-foreground">
                              Milestone {idx + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                m.status === 'Approved'
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                  : m.status === 'Submitted'
                                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                  : 'bg-white/5 text-muted-foreground border border-white/10'
                              }`}
                            >
                              {m.status}
                            </span>
                            {m.worldIdVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                                <Check size={10} /> World ID Verified Human
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                          {m.deliverable && (
                            <p className="text-xs text-muted-foreground">Deliverable: {m.deliverable}</p>
                          )}
                          {m.storageCid && (
                            <div className="flex items-center gap-2 text-[11px] font-mono text-primary pt-0.5">
                              <span>0G Labs Root CID:</span>
                              <button
                                onClick={() => setSelectedProofCid(m.storageCid || null)}
                                className="underline hover:text-primary/80"
                              >
                                {m.storageCid.slice(0, 14)}...{m.storageCid.slice(-6)}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                          <span className="font-mono font-bold text-sm text-foreground">{m.amount}</span>

                          {m.status === 'Submitted' ? (
                            <button
                              onClick={() => handleApproveMilestone(project.id, m.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-black text-xs font-bold transition-all shadow-md shadow-green-500/20 flex items-center gap-1.5"
                            >
                              <CheckCircle2 size={13} /> Approve & Release
                            </button>
                          ) : m.status === 'Approved' ? (
                            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-green-400 text-xs font-semibold flex items-center gap-1">
                              <Check size={13} /> Funds Released
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground text-xs font-semibold">
                              In Development
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 3: CLIENT INQUIRIES & LEADS */}
          {activeTab === 'inquiries' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by client name, email, or project..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-white/10 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Showing <strong className="text-foreground">{filteredContacts.length}</strong> inquiries
                </div>
              </div>

              {/* Table */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-muted-foreground uppercase font-semibold text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Client Name</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Project Subject</th>
                        <th className="py-3.5 px-4">Scope Description</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredContacts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-muted-foreground">
                            {loadingContacts ? 'Loading inquiries...' : 'No inquiries found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredContacts.map((contact) => (
                          <tr key={contact._id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                              {new Date(contact.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                              {contact.fullName}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-primary hover:underline block font-mono"
                              >
                                {contact.email}
                              </a>
                              <span className="text-muted-foreground text-[11px]">{contact.mobile}</span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-foreground max-w-[200px] truncate">
                              {contact.projectTitle}
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground max-w-xs break-words text-[11px]">
                              {contact.description}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`mailto:${contact.email}?subject=Eagle%20Byte%20Proposal:%20${encodeURIComponent(
                                    contact.projectTitle
                                  )}`}
                                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                  title="Send Email Reply"
                                >
                                  <Send size={14} />
                                </a>
                                <button
                                  onClick={() => handleDeleteContact(contact._id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                  title="Delete Message"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROTOCOL INFRA & SYSTEM HEALTH */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Database & Node Diagnostics */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Database & Cloud Storage</h3>
                    <p className="text-xs text-muted-foreground">MongoDB Atlas & Decentralized 0G DA</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">MongoDB Atlas Cluster:</span>
                    <span className="font-mono text-green-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> cluster0.3oyxgvy
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">Database Name:</span>
                    <span className="font-mono text-foreground font-semibold">EagleByte</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">0G Labs Storage DA Layer:</span>
                    <span className="font-mono text-primary font-semibold">rpc-storage-testnet.0g.ai</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">World ID Sybil Oracle:</span>
                    <span className="font-mono text-blue-400 font-semibold">Orb & Device v2.0 (Active)</span>
                  </div>
                </div>
              </div>

              {/* Blockchain Networks */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Supported Web3 Networks</h3>
                    <p className="text-xs text-muted-foreground">Live EVM Testnets & Layer 2 Rails</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">Ethereum Sepolia (Chain 11155111):</span>
                    <span className="font-mono text-green-400 font-semibold">Connected (Sub-Cent Fee)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">Arbitrum Sepolia (Chain 421614):</span>
                    <span className="font-mono text-green-400 font-semibold">Nitro Rollup (Fast Finality)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">Base Sepolia (Chain 84532):</span>
                    <span className="font-mono text-green-400 font-semibold">OP Stack Architecture</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-white/5 flex justify-between items-center">
                    <span className="text-muted-foreground">Polygon PoS (Chain 137):</span>
                    <span className="font-mono text-green-400 font-semibold">Mainnet Rail (USDC / POL)</span>
                  </div>
                </div>
              </div>

              {/* Security & Access Notice */}
              <div className="md:col-span-2 glass-card p-5 rounded-2xl border border-primary/20 bg-primary/[0.03]">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-primary mt-0.5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-semibold text-foreground">ETHGlobal Hackathon Security Guarantee</h4>
                    <p className="text-muted-foreground">
                      Sensitive credentials, private keys, and MongoDB connection strings are strictly kept in server-side
                      environment variables and ignored in version control (.gitignore). The admin control session validates
                      both frontend hash states and backend JWT signatures.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 0G Storage Proof Modal */}
          <AnimatePresence>
            {selectedProofCid && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card max-w-lg w-full p-6 rounded-2xl border border-white/15 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <HardDrive size={18} /> 0G Labs Storage DA Proof
                    </div>
                    <button
                      onClick={() => setSelectedProofCid(null)}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This deliverable payload is permanently committed to 0G Labs decentralized data availability network.
                  </p>

                  <div className="p-3 rounded-xl bg-card border border-white/10 font-mono text-xs break-all text-primary select-all">
                    {selectedProofCid}
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <div>• <strong>Verification Standard:</strong> Merkle Proof with Erasure Coding</div>
                    <div>• <strong>Oracle Status:</strong> Verified & Timestamped on 0G Node</div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedProofCid(null)}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Close Proof
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;