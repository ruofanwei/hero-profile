import { Outlet } from 'react-router-dom';
import { css } from 'styled-components';
import HeroList from '../components/HeroList';

const HeroListLayout = () => (
  <div
    css={css`
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 20px 64px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    `}
  >
    <HeroList />
    <Outlet />
  </div>
);

export default HeroListLayout;
