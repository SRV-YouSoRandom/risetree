import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { createPublicShredClient, createPublicSyncClient, shredsWebSocket } from 'shreds/viem';
import { riseTestnet } from 'viem/chains';

export const RISECHAIN_CONFIG = {
  chainId: 1,
  name: 'Rise Testnet',
  network: 'rise-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rise',
    symbol: 'RISE',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RISECHAIN_RPC_URL || 'https://rpc.risechain.com'],
      webSocket: [import.meta.env.VITE_RISECHAIN_WS_URL || 'wss://ws.risechain.com'],
    },
    public: {
      http: [import.meta.env.VITE_RISECHAIN_RPC_URL || 'https://rpc.risechain.com'],
      webSocket: [import.meta.env.VITE_RISECHAIN_WS_URL || 'wss://ws.risechain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Rise Explorer', url: 'https://explorer.risechain.com' },
  },
};

// Public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: riseTestnet,
  transport: http(RISECHAIN_CONFIG.rpcUrls.default.http[0]),
});

// Shred client for real-time updates
export const shredClient = createPublicShredClient({
  chain: riseTestnet,
  transport: shredsWebSocket(RISECHAIN_CONFIG.rpcUrls.default.webSocket[0]),
});

// Sync client for fast transactions
export const syncClient = createPublicSyncClient({
  chain: riseTestnet,
  transport: shredsWebSocket(RISECHAIN_CONFIG.rpcUrls.default.webSocket[0]),
});

// Wallet client (will be created when wallet is connected)
export const createWalletClientForProvider = (provider: any) => {
  return createWalletClient({
    chain: riseTestnet,
    transport: custom(provider),
  });
};
