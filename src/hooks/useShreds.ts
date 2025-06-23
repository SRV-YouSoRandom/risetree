import { useEffect, useState } from 'react';
import { shredClient } from '@/utils/risechain';

export const useShreds = () => {
  const [latestShred, setLatestShred] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let unwatch: (() => void) | undefined;

    const watchShreds = async () => {
      try {
        unwatch = shredClient.watchShreds({
          onShred: (shred) => {
            setLatestShred(shred);
            setIsConnected(true);
          },
          onError: (error) => {
            console.error('Shred watch error:', error);
            setIsConnected(false);
          },
        });
      } catch (error) {
        console.error('Failed to watch shreds:', error);
        setIsConnected(false);
      }
    };

    watchShreds();

    return () => {
      if (unwatch) {
        unwatch();
      }
    };
  }, []);

  return {
    latestShred,
    isConnected,
  };
};