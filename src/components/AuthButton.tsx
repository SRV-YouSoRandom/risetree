import React from 'react';
import { LogIn, LogOut, Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { generateGoogleAuthUrl, generateDiscordAuthUrl } from '@/utils/auth';

export const AuthButton: React.FC = () => {
  const { walletState, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const handleGoogleLogin = () => {
    window.location.href = generateGoogleAuthUrl();
  };

  const handleDiscordLogin = () => {
    window.location.href = generateDiscordAuthUrl();
  };

  if (walletState.isConnected) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-green-100 rounded-lg">
          <Wallet className="w-4 h-4 text-green-600" />
          <span className="text-xs sm:text-sm text-green-800 hidden sm:inline">
            {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-rise-600 text-white rounded-lg hover:bg-rise-700 transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
      >
        <Wallet className="w-4 sm:w-5 h-4 sm:h-5" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      <div className="hidden sm:block text-center text-gray-500 text-sm">or</div>
      
      <div className="flex gap-2 sm:gap-4">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none"
        >
          <LogIn className="w-4 h-4" />
          Google
        </button>
        <button
          onClick={handleDiscordLogin}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex-1 sm:flex-none"
        >
          <LogIn className="w-4 h-4" />
          Discord
        </button>
      </div>
    </div>
  );
};