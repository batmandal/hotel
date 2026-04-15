'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
} as const;

type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-bold',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
