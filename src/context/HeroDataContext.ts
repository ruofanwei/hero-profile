import { createContext } from 'react';
import type { Hero } from '../api/heroes';

export type HeroDataContextValue = {
  heroes: Hero[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const HeroDataContext = createContext<HeroDataContextValue | undefined>(
  undefined,
);
