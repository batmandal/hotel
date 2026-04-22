'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { AuthFormCard, AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

const SIGNUP_IMAGE = 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=1920';

const inputClass =
  'mt-2 h-11 rounded-xl border-white/15 bg-white/10 text-white placeholder:text-white/70 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/25';

export default function SignupPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { login } = useAuth();
  const t = useTranslations(locale);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(locale === 'mn' ? 'Нууц үг тохирохгүй байна.' : 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError(locale === 'mn' ? 'Нууц үг хамгийн багадаа 6 тэмдэгт.' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: fullName,
          password,
          phone: phone.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || (locale === 'mn' ? 'Бүртгэл амжилтгүй' : 'Signup failed'));
        setLoading(false);
        return;
      }

      // Бүртгэл амжилттай → автомат нэвтрэх
      login(json.data.email, 'GUEST', {
        displayName: json.data.name,
        phone: json.data.phone || undefined,
      });
      router.push('/');
    } catch {
      setError(locale === 'mn' ? 'Сервертэй холбогдож чадсангүй' : 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const signupT = (t as { signup?: { title: string; subtitle: string; firstName: string; lastName: string; phone: string; email: string; password: string; confirmPassword: string; submit: string; haveAccount: string; backHome: string } }).signup;

  return (
    <AuthSplitLayout
      imageSrc={SIGNUP_IMAGE}
      variant="overlay"
      brandTagline={
        locale === 'mn' ? (
          <>Бүртгүүлээд өрөөгөө захиалаарай.</>
        ) : (
          <>Sign up and start booking.</>
        )
      }
      contentMaxClassName="max-w-lg"
    >
      <AuthFormCard variant="glass">
        <h1 className="text-center text-3xl font-bold tracking-tight text-white">
          {signupT?.title ?? (locale === 'mn' ? 'Бүртгэл үүсгэх' : 'Create account')}
        </h1>
        <p className="mt-2 text-center text-sm text-white/80">
          {signupT?.subtitle ?? (locale === 'mn' ? 'Доорх мэдээллээр бүртгүүлнэ үү.' : 'Join UbHotel with your details below.')}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="signup-firstName" className="block text-sm font-medium text-white/90">
                {signupT?.firstName ?? (locale === 'mn' ? 'Нэр' : 'First name')}
              </label>
              <Input
                id="signup-firstName"
                type="text"
                placeholder={locale === 'mn' ? 'Нэр' : 'John'}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="signup-lastName" className="block text-sm font-medium text-white/90">
                {signupT?.lastName ?? (locale === 'mn' ? 'Овог' : 'Last name')}
              </label>
              <Input
                id="signup-lastName"
                type="text"
                placeholder={locale === 'mn' ? 'Овог' : 'Doe'}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="signup-phone" className="block text-sm font-medium text-white/90">
              {signupT?.phone ?? (locale === 'mn' ? 'Утасны дугаар' : 'Phone number')}
            </label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="+976 9911 2233"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-white/90">
              {signupT?.email ?? (locale === 'mn' ? 'Имэйл' : 'Email')}
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-white/90">
              {signupT?.password ?? (locale === 'mn' ? 'Нууц үг' : 'Password')}
            </label>
            <div className="relative mt-2">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-16`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-white/85 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-white/90">
              {signupT?.confirmPassword ?? (locale === 'mn' ? 'Нууц үг баталгаажуулах' : 'Confirm password')}
            </label>
            <div className="relative mt-2">
              <Input
                id="signup-confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-16`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-white/85 hover:text-white"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error ? (
            <p className="text-sm text-red-200" role="alert">{error}</p>
          ) : null}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-white/85 text-gray-900 hover:bg-white shadow-sm text-base font-semibold disabled:opacity-50"
            size="lg"
          >
            {loading
              ? (locale === 'mn' ? 'Бүртгэж байна...' : 'Creating account...')
              : (signupT?.submit ?? (locale === 'mn' ? 'Бүртгүүлэх' : 'Sign up'))
            }
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/80">
          {signupT?.haveAccount ?? (locale === 'mn' ? 'Аль хэдийн бүртгэлтэй юу?' : 'Already have an account?')}{' '}
          <Link href="/login" className="font-semibold text-white hover:text-white underline underline-offset-4">
            {t.nav.login}
          </Link>
        </p>
      </AuthFormCard>
    </AuthSplitLayout>
  );
}
