import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ProfileCard } from '@/components/ProfileCard';
import { LinkManager } from '@/components/LinkManager';
import { NFTShowcase } from '@/components/NFTShowcase';
import { TipButton } from '@/components/TipButton';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { useShreds } from '@/hooks/useShreds';

function App() {
  const { walletState } = useWallet();
  const { profile, loading, createOrUpdateProfile } = useProfile(walletState.address);
  const { isConnected: shredsConnected } = useShreds();

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code) {
      // Handle OAuth callback here
      console.log('OAuth callback received:', { code, state });
      // In a real app, you'd exchange the code for tokens
      // and create/link the account
    }
  }, []);

  const handleUpdateProfile = async (data: any) => {
    await createOrUpdateProfile(data);
  };

  const handleUpdateLinks = async (links: any[]) => {
    if (profile) {
      await createOrUpdateProfile({ ...profile, links });
    }
  };

  const isOwner = walletState.isConnected && walletState.address;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rise-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Connection Status */}
        {walletState.isConnected && (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${shredsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                Shreds: {shredsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {walletState.chainId !== 1 && (
              <div className="text-sm text-amber-600">
                ⚠️ Switch to Risechain network
              </div>
            )}
          </div>
        )}

        {/* Profile Section */}
        <ProfileCard
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          isOwner={!!isOwner}
        />

        {/* Links Section */}
        {(profile || isOwner) && (
          <LinkManager
            links={profile?.links || []}
            onUpdateLinks={handleUpdateLinks}
            isOwner={!!isOwner}
          />
        )}

        {/* NFT Showcase */}
        {(profile || isOwner) && (
          <NFTShowcase
            nfts={profile?.nfts || []}
            isOwner={!!isOwner}
          />
        )}

        {/* Tip Button */}
        {profile && walletState.address !== profile.wallet_address && (
          <div className="text-center">
            <TipButton
              recipientAddress={profile.wallet_address}
              recipientName={profile.display_name || profile.username || 'User'}
            />
          </div>
        )}

        {/* Welcome Message */}
        {!walletState.isConnected && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to RiseLink
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Create your Web3 profile on Risechain
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold mb-4">Get Started</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your wallet or use social login to create your profile
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;