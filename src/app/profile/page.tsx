'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { users, bookings } from '@/data/mockData';

import { CalendarDays, Mail, Phone, Shield, LogOut, Lock } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const { isAuthenticated, isReady, userEmail, userRole, userDisplayName, userPhone, updateProfile, logout } = useAuth();

  const currentUser = useMemo(() => users.find(u => u.email === userEmail), [userEmail]);
  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter(b => b.userId === currentUser.id);
  }, [currentUser]);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveHint, setSaveHint] = useState('');

  useEffect(() => {
    const resolvedName = userDisplayName || currentUser?.name || '';
    const parts = resolvedName.split(' ');
    setLastName(parts[0] || '');
    setFirstName(parts.slice(1).join(' ') || '');
    const resolvedPhone = userPhone || currentUser?.phone || '';
    setPhone(resolvedPhone);
  }, [userDisplayName, userPhone, currentUser]);

  useEffect(() => {
    if (isReady && !isAuthenticated) router.replace('/login');
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 text-center text-sm text-gray-500">
        {locale === 'mn' ? 'Шилжиж байна…' : 'Redirecting…'}
      </div>
    );
  }

  const displayTitle = userDisplayName || currentUser?.name || userEmail || '?';
  const initials = displayTitle
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-32 pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{displayTitle}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 shrink-0" /> {userEmail}</span>
                {(userPhone || currentUser?.phone) && (
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 shrink-0" /> {userPhone || currentUser?.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <Shield className="h-3.5 w-3.5 text-brand" />
                <span className="text-xs font-bold text-brand uppercase">{userRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{myBookings.length}</p>
            <p className="text-xs font-medium text-gray-500 uppercase mt-1">
              {locale === 'mn' ? 'Нийт захиалга' : 'Total Bookings'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">
              {currentUser?.createdAt ? new Date(currentUser.createdAt).getFullYear() : '2024'}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase mt-1">
              {locale === 'mn' ? 'Гишүүн болсон' : 'Member Since'}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {locale === 'mn' ? 'Хувийн мэдээлэл засах' : 'Edit Profile'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                {locale === 'mn' ? 'И-мэйл' : 'Email'}
              </label>
              <Input value={userEmail ?? ''} readOnly className="mt-1 bg-gray-50 text-gray-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {locale === 'mn' ? 'Овог' : 'Last Name'}
                </label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1" autoComplete="family-name" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {locale === 'mn' ? 'Нэр' : 'First Name'}
                </label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1" autoComplete="given-name" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                {locale === 'mn' ? 'Утасны дугаар' : 'Phone Number'}
              </label>
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-1"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+976 9911 2233"
              />
            </div>
            {saveHint ? <p className="text-sm text-brand font-medium">{saveHint}</p> : null}
            <Button
              type="button"
              className="bg-brand hover:bg-brand-hover"
              onClick={() => {
                updateProfile({ displayName: `${lastName.trim()} ${firstName.trim()}`.trim(), phone: phone.trim() });
                setSaveHint(locale === 'mn' ? 'Хадгалагдлаа (энэ төхөөрөмж дээр).' : 'Saved on this device.');
                setTimeout(() => setSaveHint(''), 4000);
              }}
            >
              {locale === 'mn' ? 'Хадгалах' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-400" />
            {locale === 'mn' ? 'Нууц үг солих' : 'Change Password'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                {locale === 'mn' ? 'Одоогийн нууц үг' : 'Current Password'}
              </label>
              <Input type="password" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {locale === 'mn' ? 'Шинэ нууц үг' : 'New Password'}
                </label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {locale === 'mn' ? 'Давтах' : 'Confirm'}
                </label>
                <Input type="password" className="mt-1" />
              </div>
            </div>
            <Button variant="outline">
              {locale === 'mn' ? 'Нууц үг шинэчлэх' : 'Update Password'}
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          <Link href="/my-bookings">
            <Button variant="outline" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              {locale === 'mn' ? 'Миний захиалгууд' : 'My Bookings'}
            </Button>
          </Link>
          <Button type="button" variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => { logout(); router.push('/'); }}>
            <LogOut className="h-4 w-4" />
            {t.nav.logout}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
