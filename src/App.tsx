import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { Builder } from './pages/Builder';
import { Home } from './pages/Home';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? <Home /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/builder/:id"
          element={
            session ? <Builder /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/login"
          element={
            session ? <Navigate to="/" replace /> : <Auth />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}