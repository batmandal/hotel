'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ label, children, error, required, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-xs font-bold text-gray-500 uppercase">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
