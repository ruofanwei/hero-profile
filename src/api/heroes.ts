import { apiClient } from './client';

export type Hero = {
  id: string;
  name: string;
  image: string;
};

export type HeroProfile = {
  str: number;
  int: number;
  agi: number;
  luk: number;
};

export const fetchHeroes = async (): Promise<Hero[]> => {
  const response = await apiClient.get<Hero[]>('/heroes');
  return response.data;
};

export const fetchHeroProfile = async (
  heroId: string,
): Promise<HeroProfile> => {
  const response = await apiClient.get<HeroProfile>(
    `/heroes/${heroId}/profile`,
  );
  return response.data;
};

export const patchHeroProfile = async (
  heroId: string,
  profile: HeroProfile,
): Promise<void> => {
  await apiClient.patch(`/heroes/${heroId}/profile`, profile);
};
