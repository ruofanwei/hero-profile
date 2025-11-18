import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import type { PropsWithChildren } from 'react';
import { fetchHeroes } from '../api/heroes';
import type { Hero } from '../api/heroes';
import { toApiError } from '../api/client';

type HeroDataContextValue = {
  heroes: Hero[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const HeroDataContext = createContext<HeroDataContextValue | undefined>(
  undefined,
);

export const HeroDataProvider = ({ children }: PropsWithChildren) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHeroes = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchHeroes();
      setHeroes(data);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    void loadHeroes();
  }, [loadHeroes]);

  const contextValue = useMemo<HeroDataContextValue>(
    () => ({
      heroes,
      isLoading,
      isFetching,
      error,
      refetch: loadHeroes,
    }),
    [heroes, isLoading, isFetching, error, loadHeroes],
  );

  return (
    <HeroDataContext.Provider value={contextValue}>
      {children}
    </HeroDataContext.Provider>
  );
};

export const useHeroData = () => {
  const context = useContext(HeroDataContext);
  if (context === undefined) {
    throw new Error('useHeroData must be used within HeroDataProvider');
  }
  return context;
};
