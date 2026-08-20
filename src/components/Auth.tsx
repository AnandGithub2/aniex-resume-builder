import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          setMessage(error.message);
        }
      } else {
        const { data, error } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
          });

        if (error) {
          setMessage(error.message);
        } else if (data.session) {
          setMessage('Account created successfully.');
        } else {
          setMessage(
            'Account created. You can now login.'
          );
        }
      }
    } catch {
      setMessage(
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf8f2] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-[#ddd4c4]">

        <div className="mb-8 text-center">
          <div className="text-3xl font-bold text-black">
            ANIEX
          </div>

          <div className="mt-1 text-sm text-[#6b4f2a]">
            ATS Resume Builder
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {isLogin
              ? 'Enter your email and password to access your resumes.'
              : 'Create your account to save your resumes.'}
          </p>
        </div>

        <form
          onSubmit={handleAuth}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              autoComplete={
                isLogin
                  ? 'current-password'
                  : 'new-password'
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-sm font-medium underline"
          >
            {isLogin
              ? 'New user? Create an account'
              : 'Already have an account? Login'}
          </button>
        </div>

      </div>
    </div>
  );
}