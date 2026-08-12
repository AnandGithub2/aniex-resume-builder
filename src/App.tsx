import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Builder } from './pages/Builder';
import { Home } from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder/:id" element={<Builder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
