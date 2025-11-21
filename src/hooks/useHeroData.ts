import { useContext } from 'react';
import { HeroDataContext } from '../context/HeroDataContext';

export const useHeroData = () => {
  const context = useContext(HeroDataContext);
  if (context === undefined) {
    throw new Error('useHeroData must be used within HeroDataProvider');
  }
  return context;
};
