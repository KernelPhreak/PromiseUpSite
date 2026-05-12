import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext(null);

function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth request timed out')), ms)
    ),
  ]);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);

  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);

  // Kept for Base44 compatibility.
  const [appPublicSettings] = useState({ public_settings: {} });

  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const loadProfile = async (authUser) => {
    if (!authUser?.id) return null;

    const { data, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle(),
      5000
    );

    if (error) {
      console.error('Profile load failed:', error);
      return null;
    }

    return data;
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const { data, error } = await withTimeout(
        supabase.auth.getSession(),
        5000
      );

      if (error) {
        throw error;
      }

      const session = data?.session;

      if (!session?.user) {
        clearAuthState();
        return null;
      }

      const authUser = session.user;
      const userProfile = await loadProfile(authUser);

      const mergedUser = {
        id: authUser.id,
        email: authUser.email,
        full_name:
          userProfile?.full_name ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          '',
        role: userProfile?.role || 'user',
        profile: userProfile,
        raw: authUser,
      };

      setUser(mergedUser);
      setProfile(userProfile);
      setIsAuthenticated(true);

      return mergedUser;
    } catch (error) {
      console.error('Supabase auth check failed:', error);

      clearAuthState();

      setAuthError({
        type: 'auth_error',
        message: error.message || 'Authentication failed',
      });

      return null;
    } finally {
      setAuthChecked(true);
      setIsLoadingAuth(false);
    }
  };

  // Kept for Base44-generated compatibility.
  const checkAppState = checkUserAuth;

  useEffect(() => {
    let mounted = true;

    // Important:
    // Do not block initial page rendering.
    // Let public pages load immediately, then check auth in the background.
    const initAuth = async () => {
      if (!mounted) return;
      await checkUserAuth();
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session?.user) {
          clearAuthState();
          setAuthChecked(true);
          setIsLoadingAuth(false);
          return;
        }

        // Do not run Supabase calls directly inside the auth-state callback.
        // Defer the full profile/session refresh so tab-focus token refreshes cannot
        // leave the whole app sitting behind the global loading screen.
        setTimeout(() => {
          if (mounted) checkUserAuth();
        }, 0);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const logout = async (shouldRedirect = true) => {
    await supabase.auth.signOut();

    clearAuthState();
    setAuthChecked(true);
    setIsLoadingAuth(false);

    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    const next = encodeURIComponent(window.location.pathname || '/admin');
    window.location.href = `/login?next=${next}`;
  };

  const isAdmin = profile?.role === 'admin' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,

        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,

        authError,
        appPublicSettings,
        authChecked,

        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};