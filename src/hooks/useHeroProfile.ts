import { useCallback, useEffect, useState } from 'react';
import type { HeroProfile } from '../api/heroes';
import { fetchHeroProfile } from '../api/heroes';
import { toApiError } from '../api/client';

export const useHeroProfile = (heroId?: string) => {
  const [profile, setProfile] = useState<HeroProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!heroId) {
      setProfile(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchHeroProfile(heroId);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [heroId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return {
    profile,
    setProfile,
    isLoading,
    error,
    refetch: loadProfile,
  };
};
