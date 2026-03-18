export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { Star, Sparkles, ArrowRight, Shield, Truck, HeadphonesIcon, RefreshCw } from 'lucide-react'
import HeroSlider from '@/components/ui/HeroSlider'
import ProductCard from '@/components/ui/ProductCard'
import { sql } from '@/lib/db'
import { Product, Slider } from '@/types'

async function getData() {
  try {
    const [popRes, newRes, slRes] = await Promise.all([
      sql`SELECT p.*, c.name as category_name, pc.name as parent_category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN categories pc ON c.parent_id=pc.id WHERE p.is_popular=true ORDER BY p.created_at DESC LIMIT 8`,
      sql`SELECT p.*, c.name as category_name, pc.name as parent_category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN categories pc ON c.parent_id=pc.id WHERE p.is_new=true ORDER BY p.created_at DESC LIMIT 16`,
      sql`SELECT * FROM sliders WHERE is_active=true ORDER BY order_index ASC`,
    ])
    return {
      popular: popRes.rows as Product[],
      newer: newRes.rows as Product[],
      sliders: slRes.rows as Slider[],
    }
  } catch {
    return { popular: [], newer: [], sliders: [] }
  }
}

const FEATURES = [
  { icon: <Truck size={22} />, title: 'Ücretsiz Kargo', desc: 'Tüm siparişlerde geçerli' },
  { icon: <Shield size={22} />, title: 'Güvenli Sipariş', desc: 'WhatsApp ile güvenli sipariş' },
  { icon: <HeadphonesIcon size={22} />, title: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
  { icon: <RefreshCw size={22} />, title: 'Kolay İade', desc: '30 gün iade garantisi' },
]

const CATS = [
  { label: 'Ev Temizliği', slug: 'ev-temizligi', emoji: '🧹', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
  { label: 'Mutfak Aletleri', slug: 'mutfak-aletleri', emoji: '🍳', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
  { label: 'Elektrikli Aletler', slug: 'elektrikli-ev-aletleri', emoji: '⚡', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
  { label: 'Beyaz Eşya', slug: 'beyaz-esya', emoji: '🏠', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
  { label: 'Çok Satanlar', slug: 'cok-satanlar', emoji: '🔥', color: 'bg-red-50 hover:bg-red-100 text-red-700' },
]

export default async function HomePage() {
  const { popular, newer, sliders } = await getData()

  return (
    <div>
      <HeroSlider sliders={sliders} />

      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">{f.icon}</div>
                <div><p className="font-bold text-gray-800 text-sm">{f.title}</p><p className="text-gray-500 text-xs">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATS.map(cat => (
            <Link key={cat.slug} href={`/kategori/${cat.slug}`} className={`${cat.color} rounded-2xl p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5 group`}>
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <p className="font-bold text-sm">{cat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <h2 className="text-2xl font-black text-gray-800">Popüler Ürünler</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">En çok tercih edilen ürünlerimiz</p>
          </div>
          <Link href="/kategori/cok-satanlar" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:text-green-800">
            Tümünü Gör <ArrowRight size={15} />
          </Link>
        </div>
        {popular.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-gray-500 font-medium mb-2">Henüz popüler ürün eklenmemiş</p>
            <Link href="/admin/products/new" className="text-green-600 text-sm font-semibold hover:underline">
              Admin panelinden ürün ekle ve "Popüler" olarak işaretle →
            </Link>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-white/10 text-[160px] leading-none select-none pointer-events-none -mt-6">🛒</div>
          <div className="text-white relative z-10">
            <h3 className="text-2xl font-black mb-1">Sipariş vermek çok kolay!</h3>
            <p className="text-white/85 text-sm">Ürünü sepete ekle, WhatsApp üzerinden siparişini tamamla.</p>
          </div>
          <Link href="/sepet" className="bg-white text-green-700 font-black px-8 py-3 rounded-xl hover:bg-green-50 whitespace-nowrap shadow-lg relative z-10">
            Sepete Git →
          </Link>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-green-500" />
              <h2 className="text-2xl font-black text-gray-800">Yeni Ürünler</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">En yeni ürünlerimizi keşfedin</p>
          </div>
          <Link href="/kategori/yeni-urunler" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:text-green-800">
            Tümünü Gör <ArrowRight size={15} />
          </Link>
        </div>
        {newer.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {newer.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">✨</p>
            <p className="text-gray-500 font-medium mb-2">Henüz yeni ürün eklenmemiş</p>
            <Link href="/admin/products/new" className="text-green-600 text-sm font-semibold hover:underline">
              Admin panelinden ürün ekle ve "Yeni" olarak işaretle →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
