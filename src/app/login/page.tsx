"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import { AuthFormCard, AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

// City/business hotel vibe (not resort)
const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920";

const TEMP_ACCOUNTS: Array<{
  displayName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}> = [
  { displayName: "Демо зочин", email: "user@demo.mn", phone: "99112233", password: "user123", role: "GUEST" },
  { displayName: "Демо ажилтан", email: "ajiltan@demo.mn", phone: "88112233", password: "staff123", role: "STAFF" },
  { displayName: "Демо админ", email: "admin@demo.mn", phone: "77112233", password: "admin123", role: "ADMIN" },
];

const inputClass =
  "mt-2 h-11 rounded-xl border-white/15 bg-white/10 text-white placeholder:text-white/70 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/25";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { login } = useAuth();
  const t = useTranslations(locale);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const matchedAccount = TEMP_ACCOUNTS.find(
      (acc) =>
        (acc.email.toLowerCase() === normalizedIdentifier || acc.phone === normalizedIdentifier) &&
        acc.password === password
    );
    if (matchedAccount) {
      setError("");
      login(matchedAccount.email, matchedAccount.role, {
        displayName: matchedAccount.displayName,
        phone: matchedAccount.phone,
      });
      router.push("/");
      return;
    }
    setError(
      locale === "mn"
        ? "И-мэйл/утас эсвэл нууц үг буруу байна."
        : "Invalid email/phone or password."
    );
  };

  return (
    <AuthSplitLayout
      imageSrc={LOGIN_IMAGE}
      variant="overlay"
      brandTagline={
        locale === "mn" ? (
          <>
            Зочид буудлын захиалгаа хялбархан хийгээрэй.
          </>
        ) : (
          <>
            Book your hotel room in just a few steps.
          </>
        )
      }
    >
      <AuthFormCard variant="glass">
        <h1 className="text-center text-3xl font-bold tracking-tight text-white">{t.nav.login}</h1>
        <p className="mt-2 text-center text-sm text-white/80">
          {locale === "mn"
            ? "Бүртгэлтэй хаягаараа нэвтрэнэ үү."
            : "Sign in to your account."}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-identifier" className="block text-sm font-medium text-white/90">
              {locale === "mn" ? "И-мэйл эсвэл утас" : "Email or phone"}
            </label>
            <Input
              id="login-identifier"
              type="text"
              placeholder={locale === "mn" ? "user@demo.mn эсвэл 99112233" : "user@demo.mn or 99112233"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-white/90">
              {locale === "mn" ? "Нууц үг" : "Password"}
            </label>
            <div className="relative mt-2">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-16`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-white/85 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-white/85 hover:text-white">
              {locale === "mn" ? "Нууц үг мартсан?" : "Forgot password?"}
            </Link>
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-white/85 text-gray-900 hover:bg-white shadow-sm text-base font-semibold"
            size="lg"
          >
            {t.nav.login}
          </Button>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
        </form>

        <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {locale === "mn" ? "Демо account" : "Demo accounts"}
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-white/75">
            {TEMP_ACCOUNTS.map((acc) => (
              <li key={acc.email} className="leading-snug">
                {`email: ${acc.email} | phone: ${acc.phone} | password: ${acc.password} | role: ${acc.role}`}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-white/80">
          {locale === "mn" ? "Бүртгэл байхгүй юу?" : "Don't have an account?"}{" "}
          <Link href="/signup" className="font-semibold text-white hover:text-white underline underline-offset-4">
            {t.nav.signup}
          </Link>
        </p>
      </AuthFormCard>
    </AuthSplitLayout>
  );
}
