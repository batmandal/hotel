'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, Tag, Copy, Clock } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { discounts } from '@/data/mockData';
import { formatPriceFromUsd } from '@/lib/pricing';
import { useState } from 'react';

const tiers = [
  {
    name: 'Bronze',
    nameMn: 'Хүрэл',
    price: '0',
    priceMn: 'Үнэгүй',
    color: 'border-amber-700',
    bg: 'bg-amber-50',
    badge: 'bg-amber-700 text-white',
    features: [
      'Basic room rates',
      'Early check-in (subject to availability)',
      'Welcome drink on arrival',
      'Newsletter with exclusive deals',
    ],
    featuresMn: [
      'Суурь өрөөний үнэ',
      'Эрт check-in (боломжтой үед)',
      'Ирэхэд welcome drink',
      'Тусгай саналтай мэдээллийн мэдэгдэл',
    ],
  },
  {
    name: 'Silver',
    nameMn: 'Мөнгө',
    price: '₮150,000/yr',
    priceMn: '₮150,000/жил',
    color: 'border-gray-400',
    bg: 'bg-gray-50',
    badge: 'bg-gray-500 text-white',
    popular: true,
    features: [
      'All Bronze benefits',
      '10% discount on all bookings',
      'Priority check-in & late check-out',
      'Free breakfast for 2',
      'Room upgrade (when available)',
      'Free Wi-Fi premium access',
    ],
    featuresMn: [
      'Bronze-ийн бүх давуу тал',
      'Бүх захиалгад 10% хөнгөлөлт',
      'Эрэмбэтэй check-in ба орой check-out',
      '2 хүний үнэгүй өглөөний цай',
      'Өрөө ахиулах (боломжтой үед)',
      'Үнэгүй Wi-Fi premium хандалт',
    ],
  },
  {
    name: 'Gold',
    nameMn: 'Алт',
    price: '₮350,000/yr',
    priceMn: '₮350,000/жил',
    color: 'border-yellow-500',
    bg: 'bg-yellow-50',
    badge: 'bg-yellow-500 text-white',
    features: [
      'All Silver benefits',
      '20% discount on all bookings',
      'Guaranteed room upgrade',
      'Free airport transfer',
      'Complimentary spa access',
      'Dedicated concierge service',
      'Exclusive event invitations',
      'Free minibar restocking',
    ],
    featuresMn: [
      'Silver-ийн бүх давуу тал',
      'Бүх захиалгад 20% хөнгөлөлт',
      'Өрөө ахиулах баталгаатай',
      'Үнэгүй нисэх буудлын тээвэр',
      'Үнэгүй спа хандалт',
      'Хувийн concierge үйлчилгээ',
      'Тусгай арга хэмжээний урилга',
      'Үнэгүй minibar дүүргэлт',
    ],
  },
];

export default function MembershipsPage() {
  const { locale } = useLocale();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">

        {/* Membership Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h1 className="font-display italic text-3xl font-bold text-gray-900">
              {locale === 'mn' ? 'Гишүүнчлэл' : 'Membership'}
            </h1>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              {locale === 'mn'
                ? 'Гишүүнчлэлийн багц сонгоод хөнгөлөлт, нэмэлт үйлчилгээ аваарай.'
                : 'Choose a membership tier to get discounts and extra benefits.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border-2 ${tier.color} ${tier.bg} p-6 shadow-sm flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                    {locale === 'mn' ? 'Хамгийн түгээмэл' : 'Most Popular'}
                  </div>
                )}
                <div className="mb-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase ${tier.badge}`}>
                    {locale === 'mn' ? tier.nameMn : tier.name}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{locale === 'mn' ? tier.nameMn : tier.name}</h2>
                <p className="text-3xl font-black text-gray-900 mt-4">{locale === 'mn' ? tier.priceMn : tier.price}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {(locale === 'mn' ? tier.featuresMn : tier.features).map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-hover transition-colors">
                  {locale === 'mn' ? `${tier.nameMn} багцад нэгдэх` : `Join ${tier.name}`}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Offers / Discount Codes Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-display italic text-3xl font-bold text-gray-900">
              {locale === 'mn' ? 'Хөнгөлөлт' : 'Special Offers'}
            </h2>
            <p className="mt-3 text-gray-600">
              {locale === 'mn'
                ? 'Захиалга хийхдээ хөнгөлөлтийн кодоо ашиглаарай.'
                : 'Use a discount code when booking your stay.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {discounts.map((d) => {
              const isPercentage = d.type === 'percentage';
              const daysLeft = Math.max(0, Math.ceil((new Date(d.validTo).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              const isExpiring = daysLeft <= 7;

              return (
                <div key={d.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`px-6 py-5 ${isPercentage ? 'bg-gradient-to-br from-brand to-brand-hover' : 'bg-gradient-to-br from-purple-600 to-purple-700'} text-white`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                        {isPercentage
                          ? locale === 'mn' ? 'Хувийн хөнгөлөлт' : 'Percentage Off'
                          : locale === 'mn' ? 'Тогтмол хөнгөлөлт' : 'Fixed Discount'}
                      </span>
                    </div>
                    <p className="text-4xl font-black">
                      {isPercentage ? `${d.value}%` : formatPriceFromUsd(d.value, locale)}
                    </p>
                    <p className="text-sm opacity-90 mt-1">
                      {isPercentage
                        ? locale === 'mn' ? 'захиалгад хасагдана' : 'off your booking'
                        : locale === 'mn' ? 'нийт үнийн дүнгээс хасагдана' : 'off total price'}
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <code className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-md font-bold text-sm tracking-wider">
                        {d.code}
                      </code>
                      <button
                        onClick={() => handleCopy(d.code, d.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand transition-colors"
                      >
                        {copiedId === d.id ? (
                          <><Check className="h-3.5 w-3.5" /> {locale === 'mn' ? 'Хууллаа!' : 'Copied!'}</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /> {locale === 'mn' ? 'Хуулах' : 'Copy'}</>
                        )}
                      </button>
                    </div>

                    {d.minNights != null && (
                      <p className="text-xs text-gray-500 mb-2">
                        {locale === 'mn' ? 'Хамгийн бага:' : 'Min stay:'}{' '}
                        <span className="font-semibold text-gray-700">
                          {d.minNights} {locale === 'mn' ? 'шөнө' : 'nights'}
                        </span>
                      </p>
                    )}

                    <div className={`flex items-center gap-1.5 text-xs font-medium ${isExpiring ? 'text-red-600' : 'text-gray-500'}`}>
                      <Clock className="h-3.5 w-3.5" />
                      {isExpiring
                        ? locale === 'mn'
                          ? `${daysLeft} хоногийн дараа дуусна!`
                          : `Expires in ${daysLeft} days!`
                        : locale === 'mn'
                          ? `${d.validTo} хүртэл хүчинтэй`
                          : `Valid until ${d.validTo}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
