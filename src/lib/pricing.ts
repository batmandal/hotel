import type { Locale } from '@/lib/i18n';

/** Mock өгөгдөл USD; харуулалтад MNT руу хөрвүүлэх ханш */
export const USD_MNT_RATE = 3600;

export function usdToMnt(usd: number): number {
  return Math.round(usd * USD_MNT_RATE);
}

/** SSR болон хөтөчид ижил — mn-MN + MNT currency нь Node/browser-оор өөр гарц өгдөг */
function formatGroupedInt(n: number): string {
  return Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true });
}

export function formatMntAmount(mnt: number, options?: { compact?: boolean }): string {
  const rounded = Math.round(mnt);
  if (options?.compact) {
    const a = Math.abs(rounded);
    if (a >= 1_000_000_000) return `₮${(rounded / 1_000_000_000).toFixed(1)}B`;
    if (a >= 1_000_000) return `₮${(rounded / 1_000_000).toFixed(1)}M`;
    if (a >= 1_000) return `₮${(rounded / 1_000).toFixed(1)}K`;
    return `₮${rounded}`;
  }
  return `₮ ${formatGroupedInt(rounded)}`;
}

export function formatUsdAmount(usd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}

export function formatMntFromUsd(usd: number): string {
  return formatMntAmount(usdToMnt(usd));
}

/** en: зөвхөн $, mn: зөвхөн ₮ */
export function formatPriceFromUsd(usd: number, locale: Locale): string {
  return locale === 'mn' ? formatMntFromUsd(usd) : formatUsdAmount(usd);
}

/** Профайл гэх мэт — нэг валют, товчлол */
export function formatSpendCompact(totalUsd: number, locale: Locale): string {
  return locale === 'mn'
    ? formatMntAmount(usdToMnt(totalUsd), { compact: true })
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 0,
      }).format(totalUsd);
}
