import { describe, expect, it, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroProfilePanel from '../HeroProfilePanel';

const mockRefetchHeroes = vi.fn();
const mockPatchHeroProfile = vi.fn();
const mockSetProfile = vi.fn();

vi.mock('../../hooks/useHeroData', () => ({
  useHeroData: () => ({
    heroes: [{ id: '1', name: 'Daredevil', image: 'image-1' }],
    refetch: mockRefetchHeroes,
  }),
}));

vi.mock('../../api/heroes', async () => {
  const actual =
    await vi.importActual<typeof import('../../api/heroes')>(
      '../../api/heroes',
    );
  return {
    ...actual,
    patchHeroProfile: (...args: Parameters<typeof actual.patchHeroProfile>) =>
      mockPatchHeroProfile(...args),
  };
});

const mockUseHeroProfile = vi.fn();

vi.mock('../../hooks/useHeroProfile', () => ({
  useHeroProfile: (...args: Parameters<typeof mockUseHeroProfile>) =>
    mockUseHeroProfile(...args),
}));

const renderPanel = () =>
  render(
    <MemoryRouter initialEntries={['/heroes/1']}>
      <Routes>
        <Route path="/heroes/:heroId" element={<HeroProfilePanel />} />
      </Routes>
    </MemoryRouter>,
  );

describe('HeroProfilePanel', () => {
  beforeEach(() => {
    mockRefetchHeroes.mockResolvedValue(undefined);
    mockPatchHeroProfile.mockResolvedValue(undefined);
    mockSetProfile.mockReset();
    mockUseHeroProfile.mockReturnValue({
      profile: { str: 2, int: 7, agi: 9, luk: 7 },
      setProfile: mockSetProfile,
      isLoading: false,
      error: null,
    });
  });

  it('updates remaining points when stats change', async () => {
    const user = userEvent.setup();
    renderPanel();

    const decreaseStrButton = screen.getByRole('button', {
      name: /decrease str/i,
    });
    await user.click(decreaseStrButton);

    expect(screen.getByText('剩餘點數：1')).toBeInTheDocument();
  });

  it('saves profile after redistributing all points', async () => {
    const user = userEvent.setup();
    renderPanel();

    const decreaseStrButton = screen.getByRole('button', {
      name: /decrease str/i,
    });
    await user.click(decreaseStrButton);

    const increaseIntButton = screen.getByRole('button', {
      name: /increase int/i,
    });
    await user.click(increaseIntButton);

    const saveButton = screen.getByRole('button', { name: /儲\s*存/ });
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    expect(mockPatchHeroProfile).toHaveBeenCalledWith('1', {
      str: 1,
      int: 8,
      agi: 9,
      luk: 7,
    });
    expect(mockSetProfile).toHaveBeenCalled();
    expect(mockRefetchHeroes).toHaveBeenCalled();
  });
});
