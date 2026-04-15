'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { ChevronDown, MapPin, Phone, Mail, Shield, HelpCircle, Play, Star } from 'lucide-react';
import { useState } from 'react';

const faqItems = [
  {
    q: 'How do I make a reservation?',
    qMn: 'Би яаж захиалга хийх вэ?',
    a: 'Browse our rooms page, select your dates and room type, then follow the 3-step booking process. You will receive a confirmation number after completing your booking.',
    aMn: 'Өрөөний хуудсаар орж огноо, өрөөний төрлөө сонгоод 3 алхамт захиалгын процессыг дагана уу. Захиалга амжилттай бол баталгаажуулалтын дугаар авна.',
  },
  {
    q: 'What is the cancellation policy?',
    qMn: 'Цуцлалтын нөхцөл юу вэ?',
    a: 'Free cancellation up to 30 days before check-in for a full refund. 14-29 days: 75% refund. 7-13 days: 50% refund. 3-6 days: 25% refund. Less than 3 days: no refund.',
    aMn: 'Орох өдрөөс 30-аас дээш хоногийн өмнө цуцалбал 100% буцаалттай. 14-29 хоног: 75%, 7-13 хоног: 50%, 3-6 хоног: 25%, 3-аас бага хоног: буцаалтгүй.',
  },
  {
    q: 'What time is check-in and check-out?',
    qMn: 'Ирэх болон гарах цаг хэд вэ?',
    a: 'Standard check-in is 2:00 PM and check-out is 12:00 PM. Early check-in and late check-out are available upon request and subject to availability.',
    aMn: 'Стандарт check-in 14:00, check-out 12:00. Эрт ирэх болон орой гарах хүсэлтийг боломжтой үед зөвшөөрнө.',
  },
  {
    q: 'Is breakfast included?',
    qMn: 'Өглөөний цай багтсан уу?',
    a: 'Breakfast inclusion depends on your room type and membership tier. Silver and Gold members enjoy complimentary breakfast. You can also add it as an extra service.',
    aMn: 'Өглөөний цай багтах эсэх нь өрөөний төрөл болон гишүүнчлэлийн түвшнээс хамаарна. Silver, Gold түвшин үнэгүй өглөөний цайтай.',
  },
];

const teamMembers = [
  {
    nameEn: 'B. Bat-Erdene',
    nameMn: 'Б. Бат-Эрдэнэ',
    roleEn: 'General Manager',
    roleMn: 'Ерөнхий менежер',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  },
  {
    nameEn: 'S. Sarnai',
    nameMn: 'С. Сарнай',
    roleEn: 'Front Desk Manager',
    roleMn: 'Ресепшн менежер',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    nameEn: 'T. Temuulen',
    nameMn: 'Т. Тэмүүлэн',
    roleEn: 'Head Chef',
    roleMn: 'Тогооч дарга',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    nameEn: 'N. Nomin',
    nameMn: 'Н. Номин',
    roleEn: 'Housekeeping Supervisor',
    roleMn: 'Цэвэрлэгээний ахлагч',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function MorePage() {
  const { locale } = useLocale();
  const { userRole } = useAuth();
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-32 pb-20">

        {/* About Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'mn' ? 'UbHotel-ийн тухай' : 'About UbHotel'}
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <span className="text-sm font-medium text-gray-500 ml-1">5-{locale === 'mn' ? 'одтой зочид буудал' : 'Star Hotel'}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {locale === 'mn'
                ? 'UbHotel нь Улаанбаатар хотын Сүхбаатар талбайн ойролцоо байрлах 5 одтой зочид буудал. Стандарт өрөөнөөс люкс сүүт хүртэл 45 гаруй өрөөтэй бөгөөд жим, усан сан, ресторан, спа зэрэг үйлчилгээтэй.'
                : 'UbHotel is a 5-star hotel near Sukhbaatar Square in Ulaanbaatar. With over 45 rooms ranging from standard to luxury suites, we offer gym, pool, restaurant, spa, and more.'}
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              {locale === 'mn'
                ? '5 жилийн туршлагатай, 2,400 гаруй сэтгэл ханамжтай зочдод үйлчилсэн манай баг Монголын зочломтгой уламжлалыг орчин үеийн тав тухтай хослуулдаг.'
                : 'With 5 years of experience and over 2,400 satisfied guests, our team combines Mongolian hospitality traditions with modern comfort.'}
            </p>
          </div>
        </section>

        {/* Hotel Video Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'mn' ? 'Буудлын видео' : 'Hotel Video'}
          </h2>
          <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-900 aspect-video">
            {videoPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="UbHotel Video"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src="/hero-bg.webp"
                  alt="UbHotel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                <div className="absolute inset-0 bg-black/30" />
                <button
                  type="button"
                  onClick={() => setVideoPlaying(true)}
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand shadow-xl transition hover:scale-105 hover:bg-white"
                  aria-label="Play video"
                >
                  <Play className="h-10 w-10 fill-current pl-1" aria-hidden />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-bold">{locale === 'mn' ? 'UbHotel танилцуулга' : 'UbHotel Introduction'}</p>
                  <p className="text-sm text-white/80">{locale === 'mn' ? 'Манай буудлыг видеогоор үзнэ үү' : 'Watch our hotel tour video'}</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Location / Map Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand" />
            {locale === 'mn' ? 'Байршил' : 'Location'}
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="aspect-[2/1] w-full bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.2!2d106.9177!3d47.9187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96925be2b18c6d%3A0x8454f3bca6e5a24e!2sSukhbaatar%20Square!5e0!3m2!1sen!2smn!4v1"
                className="h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UbHotel Location"
              />
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{locale === 'mn' ? 'Хаяг' : 'Address'}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {locale === 'mn' ? 'Сүхбаатар талбай, Сүхбаатар дүүрэг, Улаанбаатар' : 'Sukhbaatar Square, Sukhbaatar District, Ulaanbaatar'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{locale === 'mn' ? 'Утас' : 'Phone'}</p>
                    <p className="text-sm text-gray-600 mt-1">+976 7011-2233</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-1">info@ubhotel.mn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'mn' ? 'Манай баг' : 'Our Team'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.nameEn} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-center">
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={member.image}
                    alt={locale === 'mn' ? member.nameMn : member.nameEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900">{locale === 'mn' ? member.nameMn : member.nameEn}</p>
                  <p className="text-sm text-brand mt-0.5">{locale === 'mn' ? member.roleMn : member.roleEn}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand" />
            {locale === 'mn' ? 'Түгээмэл асуултууд' : 'FAQ'}
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6">
            {faqItems.map((item) => (
              <FaqItem
                key={item.q}
                q={locale === 'mn' ? item.qMn : item.q}
                a={locale === 'mn' ? item.aMn : item.a}
              />
            ))}
          </div>
        </section>

        {/* Portal Links */}
        {(userRole === 'STAFF' || userRole === 'ADMIN') && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand" />
              {locale === 'mn' ? 'Ажилтны нөөц' : 'Staff Resources'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/staff"
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow block"
              >
                <h3 className="font-bold text-gray-900">{locale === 'mn' ? 'Ажилтны самбар' : 'Staff Portal'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {locale === 'mn'
                    ? 'Өрөөний менежмент, цэвэрлэгээний тайлан, эзлэлт хяналт'
                    : 'Room management, housekeeping reports, occupancy tracking'}
                </p>
              </Link>
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow block"
                >
                  <h3 className="font-bold text-gray-900">{locale === 'mn' ? 'Админ самбар' : 'Admin Portal'}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {locale === 'mn'
                      ? 'Орлогын тайлан, ажилтны менежмент, системийн удирдлага'
                      : 'Revenue reports, staff management, system administration'}
                  </p>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
