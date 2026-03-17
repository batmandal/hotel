'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

const LOGIN_IMAGE = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200';

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: image / brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <Image
          src={LOGIN_IMAGE}
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold tracking-tight">BookINN</span>
          </Link>
          <p className="mt-4 text-sm text-white/90 max-w-sm">
            {locale === 'mn'
              ? 'Тав тухтай ор, шилдэг үйлчилгээ. Зочид буудлын захиалгаа эндээс эхлүүл.'
              : 'Comfortable stays, exceptional service. Start your hotel booking here.'}
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-xl font-bold text-teal-600">BookINN</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t.nav.login}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {locale === 'mn' ? 'Тавтай морил. Бүртгэлтэй хаягаараа нэвтрэнэ үү.' : 'Welcome back. Sign in with your account.'}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder={locale === 'mn' ? 'имэйл хаяг' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t.nav.login}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            {locale === 'mn' ? 'Туршилт: дурын имэйл, нууц үг оруулаад үргэлжлүүлнэ.' : 'Demo: use any email and password to continue.'}
          </p>
          <Link
            href="/"
            className="mt-6 block text-center text-sm text-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            {locale === 'mn' ? 'Нүүр хуудас руу буцах' : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
