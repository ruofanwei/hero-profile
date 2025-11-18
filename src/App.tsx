import { Navigate, Route, Routes } from 'react-router-dom';
import { css } from 'styled-components';
import HeroListLayout from './layouts/HeroListLayout';
import HeroProfilePanel from './pages/HeroProfilePanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/heroes" replace />} />
      <Route path="/heroes" element={<HeroListLayout />}>
        <Route
          index
          element={
            <div
              css={css`
                min-height: 340px;
              `}
            />
          }
        />
        <Route path=":heroId" element={<HeroProfilePanel />} />
      </Route>
      <Route path="*" element={<Navigate to="/heroes" replace />} />
    </Routes>
  );
}

export default App;
