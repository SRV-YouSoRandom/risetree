import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '@/types';
// import { createWalletClientForProvider } from '@/utils/risechain';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setWalletState({
        address: accounts[0],
        isConnected: true,
        chainId: parseInt(chainId, 16),
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
    });
  }, []);

  const switchToRisechain = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Risechain chainId
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1',
              chainName: 'Rise Testnet',
              nativeCurrency: {
                name: 'Rise',
                symbol: 'RISE',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.risechain.com'],
              blockExplorerUrls: ['https://explorer.risechain.com'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Risechain network:', addError);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setWalletState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [disconnectWallet]);

  return {
    walletState,
    connectWallet,
    disconnectWallet,
    switchToRisechain,
    isConnecting,
  };
};