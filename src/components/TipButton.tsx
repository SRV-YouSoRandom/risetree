import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { parseEther } from 'viem';
import { riseTestnet } from 'viem/chains'
import { useWallet } from '@/hooks/useWallet';
import { createWalletClientForProvider, syncClient } from '@/utils/risechain';

interface TipButtonProps {
  recipientAddress: string;
  recipientName: string;
}

export const TipButton: React.FC<TipButtonProps> = ({
  recipientAddress,
  recipientName,
}) => {
  const { walletState } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('0.01');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleTip = async () => {
    if (!walletState.isConnected || !window.ethereum) return;

    setIsSending(true);
    try {
      const walletClient = createWalletClientForProvider(window.ethereum);
      
      // Prepare the transaction
      const request = await walletClient.prepareTransactionRequest({
        account: walletState.address as `0x${string}`,
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });

      // Sign the transaction
      const txHash = await walletClient.sendTransaction({
        account: walletState.address as `0x${string}`,
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
        chain: riseTestnet,
    });

      const receipt = await syncClient.waitForTransactionReceipt({ hash: txHash });

      setTxHash(receipt.transactionHash);
      setAmount('0.01');
      
      // Show success message
      alert(`Tip sent successfully! Tx: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsSending(false);
      setIsOpen(false);
    }
  };

  if (!walletState.isConnected) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg"
      >
        <Heart className="w-5 h-5" />
        Tip {recipientName}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Send a Tip</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (RISE)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.001"
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTip}
                  disabled={isSending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                  {isSending ? 'Sending...' : 'Send Tip'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};