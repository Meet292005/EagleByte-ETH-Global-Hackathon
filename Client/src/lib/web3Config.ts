import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, arbitrum, base, optimism, mainnet } from 'wagmi/chains';

export const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '0be2f1ad02027da6d425ed4d73cfe978';

export const wagmiConfig = getDefaultConfig({
  appName: 'Eagle Byte Web3 Pay',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [polygon, arbitrum, base, optimism, mainnet],
  ssr: false,
});

export const DEFAULT_RECEIVER_ADDRESS = (
  import.meta.env.VITE_RECEIVER_ADDRESS || '0xa659547B80A34dD93e35b056E3902f0f07144D20'
) as `0x${string}`;

export const DEFAULT_RECEIVER_ENS =
  import.meta.env.VITE_RECEIVER_ENS || '';

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
  addressMap: Record<number, `0x${string}`>;
}

export const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    addressMap: {
      [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    addressMap: {
      [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      [arbitrum.id]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      [optimism.id]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      [mainnet.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    isNative: true,
    addressMap: {},
  },
  {
    symbol: 'POL',
    name: 'Polygon Ecosystem Token',
    decimals: 18,
    isNative: true,
    addressMap: {},
  },
];

export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;
