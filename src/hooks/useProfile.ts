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
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          wallet_address: walletAddress.toLowerCase(),
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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