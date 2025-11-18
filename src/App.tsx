import { Navigate, Route, Routes } from 'react-router-dom';
import HeroListLayout from './layouts/HeroListLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/heroes" replace />} />
      <Route path="/heroes" element={<HeroListLayout />} />
      <Route path="*" element={<Navigate to="/heroes" replace />} />
    </Routes>
  );
}

export default App;
