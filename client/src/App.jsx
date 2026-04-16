import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  const { user, initAuth } = useStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/*" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </>
  );
}
