import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { supabase } from '@/utils/supabase';

export const useProfile = (walletAddress: string | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateProfile = async (profileData: Partial<Profile>) => {
    if (!walletAddress && !profileData.email) {
      throw new Error('Either wallet address or email is required');
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSave = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      // If we have a wallet address, use it as the primary identifier
      if (walletAddress) {
        dataToSave.wallet_address = walletAddress.toLowerCase();
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(dataToSave, {
          onConflict: walletAddress ? 'wallet_address' : 'email',
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      console.error('Profile save error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchProfile(walletAddress);
    } else {
      setProfile(null);
    }
  }, [walletAddress]);

  return {
    profile,
    loading,
    error,
    createOrUpdateProfile,
    refetchProfile: () => walletAddress && fetchProfile(walletAddress),
  };
};