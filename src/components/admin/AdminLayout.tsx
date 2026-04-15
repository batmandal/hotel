'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText, Users, UserCheck, BedDouble, LayoutDashboard, ArrowLeft, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type AdminTab = 'overview' | 'reports' | 'staff' | 'users' | 'rooms';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  tabTitle: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const analyticsTabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Самбар', icon: LayoutDashboard },
  { key: 'reports', label: 'Тайлан', icon: FileText },
];

const listTabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'staff', label: 'Ажилчид', icon: UserCheck },
  { key: 'users', label: 'Хэрэглэгчид', icon: Users },
  { key: 'rooms', label: 'Өрөөнүүд', icon: BedDouble },
];

function NavButton({
  tab,
  activeTab,
  onClick,
  icon: Icon,
  label,
}: {
  tab: AdminTab;
  activeTab: AdminTab;
  onClick: (tab: AdminTab) => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors',
        activeTab === tab ? 'bg-brand-muted text-brand' : 'text-gray-600 hover:bg-gray-50'
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export function AdminLayout({ activeTab, onTabChange, tabTitle, headerRight, children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans flex-col md:flex-row">
      {/* Mobile menu overlay */}
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
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-brand text-white">
            <span className="text-lg font-bold">Админ удирдлага</span>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-1.5 border-b border-gray-100 pb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Аналитик</p>
            {analyticsTabs.map((t) => (
              <NavButton key={t.key} tab={t.key} activeTab={activeTab} onClick={handleTabChange} icon={t.icon} label={t.label} />
            ))}
          </nav>
          <nav className="p-4 flex flex-col gap-1.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Жагсаалт</p>
            {listTabs.map((t) => (
              <NavButton key={t.key} tab={t.key} activeTab={activeTab} onClick={handleTabChange} icon={t.icon} label={t.label} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" /> Нүүр хуудас руу буцах
            </button>
          </Link>
          <button onClick={logout} className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{tabTitle}</h1>
          </div>
          {headerRight ?? (
            <div className="text-sm font-medium text-gray-500">Огноо: {new Date().toLocaleDateString('mn-MN')}</div>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}
