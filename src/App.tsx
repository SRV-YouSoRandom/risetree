import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProfileCard } from '@/components/ProfileCard';
import { LinkManager } from '@/components/LinkManager';
import { NFTShowcase } from '@/components/NFTShowcase';
import { TipButton } from '@/components/TipButton';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { useShreds } from '@/hooks/useShreds';
import { supabase } from '@/utils/supabase';

function App() {
  const { walletState } = useWallet();
  const { profile, loading, createOrUpdateProfile } = useProfile(walletState.address);
  const { isConnected: shredsConnected } = useShreds();
  const [oauthLoading, setOauthLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code) {
        setOauthLoading(true);
        try {
          console.log('OAuth callback received:', { code, state });
          
          // Determine provider based on the current URL or state parameter
          const isDiscord = window.location.pathname.includes('discord') || 
                           state?.includes('discord') ||
                           document.referrer.includes('discord.com');
          
          let userData = null;
          
          if (isDiscord) {
            // Handle Discord OAuth
            userData = await handleDiscordCallback(code);
          } else {
            // Handle Google OAuth
            userData = await handleGoogleCallback(code);
          }
          
          if (userData) {
            // Create or update profile with OAuth data
            await createOrUpdateProfile({
              display_name: userData.name || userData.global_name || userData.username,
              username: userData.username || userData.email?.split('@')[0],
              avatar_url: userData.avatar_url || userData.picture,
              email: userData.email,
            });
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          alert('Authentication failed. Please try again.');
        } finally {
          setOauthLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, [createOrUpdateProfile]);

  const handleDiscordCallback = async (code: string): Promise<any> => {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
          client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET, // You'll need to add this
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      
      // Get user data
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      
      return {
        name: userData.global_name || userData.username,
        username: userData.username,
        email: userData.email,
        avatar_url: userData.avatar 
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : null,
        provider: 'discord',
        provider_id: userData.id,
      };
    } catch (error) {
      console.error('Discord OAuth error:', error);
      throw error;
    }
  };

  const handleGoogleCallback = async (code: string): Promise<any> => {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET, // You'll need to add this
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      
      // Get user data
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      
      return {
        name: userData.name,
        username: userData.email?.split('@')[0],
        email: userData.email,
        avatar_url: userData.picture,
        provider: 'google',
        provider_id: userData.id,
      };
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  };

  const handleUpdateProfile = async (data: any) => {
    await createOrUpdateProfile(data);
  };

  const handleUpdateLinks = async (links: any[]) => {
    if (profile) {
      await createOrUpdateProfile({ ...profile, links });
    }
  };

  const isOwner = walletState.isConnected && walletState.address;

  if (loading || oauthLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rise-600"></div>
          <span className="ml-3 text-gray-600">
            {oauthLoading ? 'Authenticating...' : 'Loading...'}
          </span>
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
        {!walletState.isConnected && !profile && (
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