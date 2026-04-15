'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, KeyRound, Check } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

type Step = 'email' | 'otp' | 'password' | 'done';

export default function ForgotPasswordPage() {
  const { locale } = useLocale();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(locale === 'mn' ? 'И-мэйл хаягаа оруулна уу.' : 'Please enter your email address.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError(locale === 'mn' ? 'OTP код буруу байна. Туршилтын код: 123456' : 'Invalid OTP code. Demo code: 123456');
      return;
    }
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError(locale === 'mn' ? 'Нууц үг дор хаяж 6 тэмдэгттэй байна.' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(locale === 'mn' ? 'Нууц үг таарахгүй байна.' : 'Passwords do not match.');
      return;
    }
    setError('');
    setStep('done');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === 'mn' ? 'Нэвтрэх рүү буцах' : 'Back to login'}
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {step === 'email' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-muted p-2.5 rounded-lg">
                  <Mail className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{locale === 'mn' ? 'Нууц үг сэргээх' : 'Forgot Password'}</h1>
                  <p className="text-sm text-gray-500">
                    {locale === 'mn' ? 'Сэргээх код авахын тулд и-мэйлээ оруулна уу' : 'Enter your email to receive a reset code'}
                  </p>
                </div>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">{locale === 'mn' ? 'И-мэйл хаяг' : 'Email Address'}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@demo.mn"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand hover:bg-brand-hover">
                  {locale === 'mn' ? 'Сэргээх код илгээх' : 'Send Reset Code'}
                </Button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-muted p-2.5 rounded-lg">
                  <KeyRound className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{locale === 'mn' ? 'Код оруулах' : 'Enter Code'}</h1>
                  <p className="text-sm text-gray-500">
                    {locale === 'mn' ? `${email} хаяг руу 6 оронтой код илгээлээ` : `We sent a 6-digit code to ${email}`}
                  </p>
                </div>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">{locale === 'mn' ? 'OTP код' : 'OTP Code'}</label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="mt-1 text-center text-lg tracking-widest font-mono"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">{locale === 'mn' ? 'Туршилтын код: 123456' : 'Demo code: 123456'}</p>
                </div>
                <Button type="submit" className="w-full bg-brand hover:bg-brand-hover">
                  {locale === 'mn' ? 'Код баталгаажуулах' : 'Verify Code'}
                </Button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-muted p-2.5 rounded-lg">
                  <KeyRound className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{locale === 'mn' ? 'Шинэ нууц үг' : 'New Password'}</h1>
                  <p className="text-sm text-gray-500">
                    {locale === 'mn' ? 'Бүртгэлдээ хүчтэй нууц үг сонгоно уу' : 'Choose a strong password for your account'}
                  </p>
                </div>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">{locale === 'mn' ? 'Шинэ нууц үг' : 'New Password'}</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">{locale === 'mn' ? 'Нууц үг давтах' : 'Confirm Password'}</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand hover:bg-brand-hover">
                  {locale === 'mn' ? 'Нууц үг шинэчлэх' : 'Reset Password'}
                </Button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{locale === 'mn' ? 'Нууц үг шинэчлэгдлээ!' : 'Password Reset!'}</h1>
              <p className="text-sm text-gray-500 mb-6">
                {locale === 'mn'
                  ? 'Таны нууц үг амжилттай шинэчлэгдлээ. Одоо шинэ нууц үгээрээ нэвтэрнэ үү.'
                  : 'Your password has been updated successfully. You can now log in with your new password.'}
              </p>
              <Link href="/login">
                <Button className="bg-brand hover:bg-brand-hover">{locale === 'mn' ? 'Нэвтрэх рүү очих' : 'Go to Login'}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
