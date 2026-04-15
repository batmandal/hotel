'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Hotel, FileCheck2, ArrowLeft, LogOut, Menu, X, UserPlus, CalendarPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type StaffTab = 'rooms' | 'guests' | 'booking' | 'reports';

interface StaffLayoutProps {
  activeTab: StaffTab;
  onTabChange: (tab: StaffTab) => void;
  locale: string;
  headerTitle: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export function StaffLayout({ activeTab, onTabChange, locale, headerTitle, headerRight, children }: StaffLayoutProps) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: StaffTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900 flex-col md:flex-row">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={cn(
          'w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col justify-between z-40 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]',
          'fixed inset-y-0 left-0 md:static md:translate-x-0 transition-transform duration-200 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-brand text-white">
            <span className="text-xl font-bold tracking-tight">Staff Portal</span>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-1.5">
            <button
              onClick={() => handleTabChange('rooms')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                activeTab === 'rooms' ? 'bg-brand-muted text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Hotel className="h-5 w-5" />
              {locale === 'mn' ? 'Өрөөний удирдлага' : 'Room Management'}
            </button>
            <button
              onClick={() => handleTabChange('guests')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                activeTab === 'guests' ? 'bg-brand-muted text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <UserPlus className="h-5 w-5" />
              {locale === 'mn' ? 'Зочин бүртгэх' : 'Register Guest'}
            </button>
            <button
              onClick={() => handleTabChange('booking')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                activeTab === 'booking' ? 'bg-brand-muted text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <CalendarPlus className="h-5 w-5" />
              {locale === 'mn' ? 'Захиалга үүсгэх' : 'New Booking'}
            </button>
            <button
              onClick={() => handleTabChange('reports')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                activeTab === 'reports' ? 'bg-brand-muted text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <FileCheck2 className="h-5 w-5" />
              {locale === 'mn' ? 'Тайлан' : 'Reports'}
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {locale === 'mn' ? 'Нүүр хуудас руу буцах' : 'Back to Site'}
            </button>
          </Link>
          <button onClick={logout} className="w-full flex mt-1 items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-4 w-4" />
            {locale === 'mn' ? 'Гарах' : 'Log out'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold">{headerTitle}</h1>
          </div>
          {headerRight}
        </header>
        {children}
      </main>
    </div>
  );
}
