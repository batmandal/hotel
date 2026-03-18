'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

const SIGNUP_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';

export default function SignupPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError(locale === 'mn' ? 'Нууц үг тохирохгүй байна.' : 'Passwords do not match.');
      return;
    }
    if (firstName && lastName && phone && email && password) {
      router.push('/login');
    }
  };

  const signupT = (t as { signup?: { title: string; subtitle: string; firstName: string; lastName: string; phone: string; email: string; password: string; confirmPassword: string; submit: string; haveAccount: string; backHome: string } }).signup;

  return (
    <div className="min-h-screen flex">
      {/* Left: image / brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <Image
          src={SIGNUP_IMAGE}
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold tracking-tight">UbHotel</span>
          </Link>
          <p className="mt-4 text-sm text-white/90 max-w-sm">
            {locale === 'mn'
              ? 'Шинэ бүртгэл үүсгээд захиалгаа хялбархан хий. Нэгдэнэ үү.'
              : 'Create an account and book with ease. Join us today.'}
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-auto">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-xl font-bold text-teal-600">UbHotel</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{signupT?.title ?? (locale === 'mn' ? 'Бүртгэл үүсгэх' : 'Create account')}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {signupT?.subtitle ?? (locale === 'mn' ? 'Доорх мэдээллээр бүртгүүлнэ үү.' : 'Join UbHotel with your details below.')}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700">
                  {signupT?.firstName ?? (locale === 'mn' ? 'Нэр' : 'First name')}
                </label>
                <Input
                  id="signup-firstName"
                  type="text"
                  placeholder={locale === 'mn' ? 'Нэр' : 'John'}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700">
                  {signupT?.lastName ?? (locale === 'mn' ? 'Овог' : 'Last name')}
                </label>
                <Input
                  id="signup-lastName"
                  type="text"
                  placeholder={locale === 'mn' ? 'Овог' : 'Doe'}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700">
                {signupT?.phone ?? (locale === 'mn' ? 'Утасны дугаар' : 'Phone number')}
              </label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder={locale === 'mn' ? '+976 9999 9999' : '+1 234 567 890'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                {signupT?.email ?? (locale === 'mn' ? 'Имэйл' : 'Email')}
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                {signupT?.password ?? (locale === 'mn' ? 'Нууц үг' : 'Password')}
              </label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                required
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">
                {signupT?.confirmPassword ?? (locale === 'mn' ? 'Нууц үг баталгаажуулах' : 'Confirm password')}
              </label>
              <Input
                id="signup-confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5"
                required
                minLength={6}
              />
              {passwordError && (
                <p className="mt-1.5 text-sm text-red-600" role="alert">{passwordError}</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg">
              {signupT?.submit ?? (locale === 'mn' ? 'Бүртгүүлэх' : 'Sign up')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            {signupT?.haveAccount ?? (locale === 'mn' ? 'Аль хэдийн бүртгэлтэй юу?' : 'Already have an account?')}{' '}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              {t.nav.login}
            </Link>
          </p>
          <Link
            href="/"
            className="mt-4 block text-center text-sm text-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            {signupT?.backHome ?? (locale === 'mn' ? 'Нүүр хуудас руу буцах' : 'Back to home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
