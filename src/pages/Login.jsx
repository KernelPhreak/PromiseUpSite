import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const checkExistingSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Session check failed:', error);
          setCheckingSession(false);
          return;
        }

        if (data?.session) {
          navigate(next, { replace: true });
          return;
        }

        setCheckingSession(false);
      } catch (err) {
        console.error('Session check crashed:', err);
        setCheckingSession(false);
      }
    };

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [navigate, next]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({
              email,
              password,
            })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: '',
                },
              },
            });

      setLoading(false);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === 'signup' && !result.data.session) {
        setError(
          'Account created. Check your email to confirm your account, then sign in.'
        );
        return;
      }

      navigate(next, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setLoading(false);
      setError(err.message || 'Login failed.');
    }
  };

  const toggleMode = () => {
    setMode((currentMode) =>
      currentMode === 'signin' ? 'signup' : 'signin'
    );
    setError('');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm text-center">
          <p className="font-inter text-muted-foreground">
            Checking login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h1 className="font-outfit text-3xl font-bold mb-2">
          Admin Login
        </h1>

        <p className="font-inter text-muted-foreground mb-8">
          Sign in to manage Promise Up content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full font-inter font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </Button>
        </form>

        <button
          type="button"
          className="mt-5 text-sm text-muted-foreground hover:text-foreground"
          onClick={toggleMode}
        >
          {mode === 'signin'
            ? 'Need an account? Create one'
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}