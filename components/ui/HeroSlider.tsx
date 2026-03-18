'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Slider } from '@/types'

const DEFAULTS = [
  { id: 1, title: 'Evinizi Dönüştürün', subtitle: 'En kaliteli ev aletleri uygun fiyatlarla', link: '/kategori/beyaz-esya', image_url: '', bg: 'from-green-800 to-green-600', emoji: '🏠' },
  { id: 2, title: 'Mutfağınızı Yenileyin', subtitle: 'Profesyonel mutfak aletleriyle yemek yapmak keyifli', link: '/kategori/mutfak-aletleri', image_url: '', bg: 'from-emerald-800 to-teal-600', emoji: '🍳' },
  { id: 3, title: 'Temiz & Konforlu Ev', subtitle: 'Güçlü elektrikli süpürgelerle tanışın', link: '/kategori/ev-temizligi', image_url: '', bg: 'from-green-900 to-green-700', emoji: '✨' },
]

export default function HeroSlider({ sliders }: { sliders: Slider[] }) {
  const [cur, setCur] = useState(0)
  const slides: any[] = sliders.length > 0 ? sliders : DEFAULTS

  const next = useCallback(() => setCur(c => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCur(c => (c - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  return (
    <div className="relative w-full overflow-hidden bg-green-800" style={{ height: '420px' }}>
      {slides.map((slide: any, i: number) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ${i === cur ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {slide.image_url ? (
            <div className="relative w-full h-full">
              <Image src={slide.image_url} alt={slide.title || ''} fill className="object-cover" priority={i === 0} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-8 w-full">
                  <div className="text-white max-w-lg">
                    {slide.title && <h2 className="text-4xl font-black mb-3 leading-tight">{slide.title}</h2>}
                    {slide.subtitle && <p className="text-lg text-white/90 mb-6">{slide.subtitle}</p>}
                    {slide.link && <Link href={slide.link} className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 shadow-lg">Keşfet →</Link>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${slide.bg} flex items-center relative overflow-hidden`}>
              <div className="absolute top-8 right-16 text-white/10 text-[180px] leading-none select-none pointer-events-none">{slide.emoji}</div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full" />
              <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
                <div className="max-w-xl text-white">
                  <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">İlkon Home Store</p>
                  <h2 className="text-5xl font-black mb-4 leading-tight">{slide.title}</h2>
                  <p className="text-xl text-white/85 mb-8">{slide.subtitle}</p>
                  <div className="flex gap-4">
                    <Link href={slide.link} className="bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 transition-all shadow-xl hover:-translate-y-0.5">
                      Ürünleri Keşfet →
                    </Link>
                    <Link href="/iletisim" className="border-2 border-white/50 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                      İletişim
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"><ChevronLeft size={22} /></button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"><ChevronRight size={22} /></button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_: any, i: number) => (
              <button key={i} onClick={() => setCur(i)} className={`transition-all duration-300 rounded-full ${i === cur ? 'bg-white w-8 h-2.5' : 'bg-white/50 w-2.5 h-2.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
