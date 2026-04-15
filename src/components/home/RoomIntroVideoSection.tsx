'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { siteStats } from '@/data/mockData';
import { useLocale } from '@/context/LocaleContext';

const VIDEO_THUMBNAIL = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200';
const VIDEO_URL = ''; // optional: real video URL for iframe

export function RoomIntroVideoSection() {
  const { locale } = useLocale();
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-white pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        {/* Video container - rounded, overlaps brand stats bar below */}
        <div className="relative -mb-12 overflow-hidden rounded-3xl shadow-2xl md:-mb-16">
          <div className="relative aspect-video w-full bg-gray-900">
            {playing && VIDEO_URL ? (
              <iframe
                src={`${VIDEO_URL}?autoplay=1`}
                title="Room introduction"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src={VIDEO_THUMBNAIL}
                  alt="Luxury resort pool and hotel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1152px"
                  priority
                />
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-xl transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-4 focus:ring-brand/40"
                  aria-label="Play video"
                >
                  <Play className="h-10 w-10 fill-current pl-1" aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Brand stats bar - video overlaps into this */}
      <div className="bg-brand px-4 pt-20 pb-16 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {siteStats.map((stat) => (
              <div key={stat.value} className="text-center text-white">
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="mt-2 text-sm text-white/80">
                  {locale === 'mn' ? (stat.labelMn ?? stat.label) : stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
