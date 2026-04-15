'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AuthSplitLayoutProps = {
  imageSrc: string;
  imageAlt?: string;
  brandTagline: ReactNode;
  children: ReactNode;
  /** Жишээ нь бүртгэл: илүү өргөн форм */
  contentMaxClassName?: string;
  /** Figma-style: full background image + centered overlay form */
  variant?: 'split' | 'overlay';
  /** Optional top area (e.g., nav/logo) for overlay */
  topContent?: ReactNode;
};

/**
 * Figma-той ойролцоо: зүүн hero зураг + баруун талд саарал суурь дээр цагаан карт.
 * Фонт (layout.tsx) болон icon-уудыг өөрчлөхгүй.
 */
export function AuthSplitLayout({
  imageSrc,
  imageAlt = '',
  brandTagline,
  children,
  contentMaxClassName,
  variant = 'split',
  topContent,
}: AuthSplitLayoutProps) {
  if (variant === 'overlay') {
    return (
      <div className="relative min-h-screen">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/65" aria-hidden />

        <div className="relative z-10 flex min-h-screen flex-col">
          {topContent ? <div className="px-4 py-4 sm:px-8">{topContent}</div> : null}

          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
            <div className={cn('w-full max-w-130', contentMaxClassName)}>
              <div className="mb-8 text-center text-white">
                <Link href="/" className="inline-flex items-center justify-center">
                  <span className="text-3xl font-bold tracking-tight drop-shadow-sm">UbHotel</span>
                </Link>
                <div className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90">
                  {brandTagline}
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <div className="relative hidden min-h-screen w-[46%] min-w-0 lg:flex lg:flex-col">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="46vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-brand/35 via-black/25 to-black/75" aria-hidden />
        <div className="relative z-10 mt-auto p-10 xl:p-12">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">UbHotel</span>
          </Link>
          <div className="mt-5 max-w-md text-sm leading-relaxed text-white/95">{brandTagline}</div>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
        <div className={cn('mx-auto w-full max-w-110', contentMaxClassName)}>{children}</div>
      </div>
    </div>
  );
}

export function AuthFormCard({
  children,
  variant = 'solid',
}: {
  children: ReactNode;
  variant?: 'solid' | 'glass';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-8 sm:p-10',
        variant === 'glass'
          ? 'border border-white/15 bg-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md ring-1 ring-white/8'
          : 'border border-gray-100/80 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/4'
      )}
    >
      {children}
    </div>
  );
}
