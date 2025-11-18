import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import HeroList from '../HeroList';

vi.mock('../../context/HeroDataContext', () => ({
  useHeroData: () => ({
    heroes: [
      { id: '1', name: 'Daredevil', image: 'image-1' },
      { id: '2', name: 'Thor', image: 'image-2' },
    ],
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('HeroList', () => {
  it('renders hero cards and highlights the selected one', () => {
    render(
      <MemoryRouter initialEntries={['/heroes/2']}>
        <Routes>
          <Route path="/heroes/:heroId" element={<HeroList />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Daredevil')).toBeInTheDocument();
    expect(screen.getByText('Thor')).toBeInTheDocument();

    const activeCard = screen.getByRole('link', { name: /Thor/i });
    expect(activeCard).toHaveAttribute('data-selected', 'true');
  });
});
