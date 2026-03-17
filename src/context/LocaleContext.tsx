'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('mn');
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  return ctx ?? { locale: 'mn' as Locale, setLocale: () => {} };
}
