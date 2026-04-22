"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import { AuthFormCard, AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Shield, UserCheck, Loader2 } from "lucide-react";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920";

type QuickAccount = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
};

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
  const [loading, setLoading] = useState(false);

  // Real accounts from DB
  const [staffAccounts, setStaffAccounts] = useState<QuickAccount[]>([]);
  const [adminAccounts, setAdminAccounts] = useState<QuickAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const staffRes = await fetch("/api/staff");
        const staffJson = await staffRes.json();
        const staffList: QuickAccount[] = (staffJson.data ?? [])
          .filter((s: any) => s.user?.role === 'staff')
          .slice(0, 1)
          .map((s: any) => ({
            name: s.user.name,
            email: s.user.email,
            phone: s.user.phone || '-',
            password: 'staff123',
            role: 'staff',
            department: s.department,
            position: s.position,
          }));

        const adminList: QuickAccount[] = (staffJson.data ?? [])
          .filter((s: any) => s.user?.role === 'admin')
          .slice(0, 1)
          .map((s: any) => ({
            name: s.user.name,
            email: s.user.email,
            phone: s.user.phone || '-',
            password: 'admin123',
            role: 'admin',
            department: s.department,
            position: s.position,
          }));

        setStaffAccounts(staffList);
        setAdminAccounts(adminList);
      } catch {
        // fallback
      } finally {
        setAccountsLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || (locale === "mn" ? "Нэвтрэх боломжгүй" : "Login failed"));
        setLoading(false);
        return;
      }

      const user = json.data;
      login(user.email, user.frontendRole as UserRole, {
        displayName: user.name,
        phone: user.phone || undefined,
      });

      if (user.frontendRole === "ADMIN") router.push("/admin");
      else if (user.frontendRole === "STAFF") router.push("/staff");
      else router.push("/");
    } catch {
      setError(locale === "mn" ? "Сервертэй холбогдож чадсангүй" : "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      imageSrc={LOGIN_IMAGE}
      variant="overlay"
      brandTagline={
        locale === "mn" ? (
          <>Зочид буудлын захиалгаа хялбархан хийгээрэй.</>
        ) : (
          <>Book your hotel room in just a few steps.</>
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
              placeholder={locale === "mn" ? "имэйл эсвэл утас" : "email or phone"}
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
            disabled={loading}
            className="h-12 w-full rounded-xl bg-white/85 text-gray-900 hover:bg-white shadow-sm text-base font-semibold disabled:opacity-50"
            size="lg"
          >
            {loading ? (locale === "mn" ? "Нэвтэрч байна..." : "Signing in...") : t.nav.login}
          </Button>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
        </form>

        {/* Real accounts info (text only) */}
        {!accountsLoading && (adminAccounts.length > 0 || staffAccounts.length > 0) && (
          <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 space-y-3">
            {adminAccounts.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-300 mb-2">
                  <Shield className="h-3.5 w-3.5" />
                  {locale === "mn" ? "Админ нэвтрэх мэдээлэл" : "Admin credentials"}
                </p>
                <table className="w-full text-xs text-white/70">
                  <thead>
                    <tr className="text-left text-white/40">
                      <th className="pb-1 font-medium">{locale === "mn" ? "Нэр" : "Name"}</th>
                      <th className="pb-1 font-medium">{locale === "mn" ? "Утас" : "Phone"}</th>
                      <th className="pb-1 font-medium">{locale === "mn" ? "Нууц үг" : "Password"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminAccounts.map((acc) => (
                      <tr key={acc.email}>
                        <td className="py-0.5 font-medium text-white/90">{acc.name}</td>
                        <td className="py-0.5 font-mono text-white/80">{acc.phone}</td>
                        <td className="py-0.5 font-mono text-white/80">{acc.password}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {staffAccounts.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-300 mb-2">
                  <UserCheck className="h-3.5 w-3.5" />
                  {locale === "mn" ? "Ажилтан нэвтрэх мэдээлэл" : "Staff credentials"}
                </p>
                <table className="w-full text-xs text-white/70">
                  <thead>
                    <tr className="text-left text-white/40">
                      <th className="pb-1 font-medium">{locale === "mn" ? "Нэр" : "Name"}</th>
                      <th className="pb-1 font-medium">{locale === "mn" ? "Утас" : "Phone"}</th>
                      <th className="pb-1 font-medium">{locale === "mn" ? "Нууц үг" : "Password"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffAccounts.map((acc) => (
                      <tr key={acc.email}>
                        <td className="py-0.5 font-medium text-white/90">{acc.name}</td>
                        <td className="py-0.5 font-mono text-white/80">{acc.phone}</td>
                        <td className="py-0.5 font-mono text-white/80">{acc.password}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
