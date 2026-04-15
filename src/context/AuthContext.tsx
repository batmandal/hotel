'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ubhotel-auth';
const AUTH_COOKIE = 'ubhotel_auth';
const AUTH_ROLE_COOKIE = 'ubhotel_role';

export type UserRole = 'GUEST' | 'STAFF' | 'ADMIN';

export type AuthProfilePatch = { displayName?: string; phone?: string };

type StoredAuth = {
  authenticated: boolean;
  email?: string;
  role?: UserRole;
  displayName?: string;
  phone?: string;
};

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string | null;
  userRole: UserRole | null;
  /** Нэр, утас (localStorage + нэвтрэлтээр бөглөгдөнө) */
  userDisplayName: string | null;
  userPhone: string | null;
  /** True after client has read localStorage (avoid SSR/redirect flash) */
  isReady: boolean;
  login: (email?: string, role?: UserRole, profile?: AuthProfilePatch) => void;
  updateProfile: (patch: AuthProfilePatch) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): StoredAuth {
  if (typeof window === 'undefined') return { authenticated: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { authenticated: false };
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed?.authenticated ? parsed : { authenticated: false };
  } catch {
    return { authenticated: false };
  }
}

function writeStored(next: StoredAuth) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    function sync() {
      const s = readStored();
      setIsAuthenticated(!!s.authenticated);
      setUserEmail(s.email ?? null);
      setUserRole(s.role ?? null);
      setUserDisplayName(s.displayName?.trim() || null);
      setUserPhone(s.phone?.trim() || null);
      setIsReady(true);
    }
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = useCallback((email?: string, role: UserRole = 'GUEST', profile?: AuthProfilePatch) => {
    const prev = readStored();
    const next: StoredAuth = {
      authenticated: true,
      email: (email?.trim() || prev.email) || undefined,
      role,
      displayName: profile?.displayName?.trim() || prev.displayName,
      phone: profile?.phone?.trim() || prev.phone,
    };
    writeStored(next);
    document.cookie = `${AUTH_COOKIE}=1; path=/; SameSite=Lax`;
    document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; SameSite=Lax`;
    setIsAuthenticated(true);
    setUserEmail(next.email ?? null);
    setUserRole(role);
    setUserDisplayName(next.displayName?.trim() || null);
    setUserPhone(next.phone?.trim() || null);
  }, []);

  const updateProfile = useCallback((patch: AuthProfilePatch) => {
    const s = readStored();
    if (!s.authenticated) return;
    const next: StoredAuth = {
      ...s,
      displayName: patch.displayName !== undefined ? patch.displayName.trim() : s.displayName,
      phone: patch.phone !== undefined ? patch.phone.trim() : s.phone,
    };
    writeStored(next);
    setUserDisplayName(next.displayName?.trim() || null);
    setUserPhone(next.phone?.trim() || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${AUTH_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${AUTH_ROLE_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    setUserDisplayName(null);
    setUserPhone(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userRole,
        userDisplayName,
        userPhone,
        isReady,
        login,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isAuthenticated: false,
      userEmail: null,
      userRole: null,
      userDisplayName: null,
      userPhone: null,
      isReady: true,
      login: () => {},
      updateProfile: () => {},
      logout: () => {},
    };
  }
  return ctx;
}
