'use client';

import { LocaleProvider } from '@/context/LocaleContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
