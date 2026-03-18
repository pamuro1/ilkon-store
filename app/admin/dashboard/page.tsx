'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Image as ImageIcon, Grid3X3, LogOut, Plus, ShoppingBag, Loader2 } from 'lucide-react'

interface Stats { products: number; categories: number; sliders: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, sliders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, cRes, sRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/sliders'),
        ])
        const [pData, cData, sData] = await Promise.all([pRes.json(), cRes.json(), sRes.json()])
        setStats({
          products: pData.products?.length || 0,
          categories: cData.categories?.length || 0,
          sliders: sData.sliders?.length || 0,
        })
      } catch {}
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.png" alt="İlkon" width={150} height={70} className="h-12 w-auto" />
          <div className="h-8 w-px bg-green-500/50" />
          <div>
            <p className="font-black text-lg">Admin Paneli</p>
            <p className="text-green-200 text-xs">İlkon Home Store</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-200 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
            <ShoppingBag size={15} /> Siteye Git
          </Link>
          <Link href="/api/admin/logout" className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <LogOut size={15} /> Çıkış
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-1">Hoş geldiniz! 👋</h1>
          <p className="text-gray-500">İlkon Home Store yönetim paneli</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-center h-24">
                <Loader2 size={24} className="animate-spin text-gray-300" />
              </div>
            ))
          ) : (
            [
              { label: 'Toplam Ürün', value: stats.products },
              { label: 'Kategori', value: stats.categories },
              { label: 'Toplam Slider', value: stats.sliders },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-3xl font-black text-gray-800">{s.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Ürünler', desc: 'Ürün ekle, düzenle, sil', href: '/admin/products', icon: <Package size={28} />, color: 'bg-blue-50 text-blue-600', stat: `${stats.products} ürün` },
            { title: 'Slider Yönetimi', desc: 'Ana sayfa slider görsellerini yönet', href: '/admin/sliders', icon: <ImageIcon size={28} />, color: 'bg-purple-50 text-purple-600', stat: `${stats.sliders} slider` },
            { title: 'Kategoriler', desc: 'Kategori ekle ve düzenle', href: '/admin/categories', icon: <Grid3X3 size={28} />, color: 'bg-orange-50 text-orange-600', stat: `${stats.categories} kategori` },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{item.desc}</p>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{item.stat}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-green-800">Hızlı Ürün Ekle</p>
            <p className="text-green-600 text-sm">Yeni bir ürün eklemek için tıklayın</p>
          </div>
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors">
            <Plus size={18} /> Ürün Ekle
          </Link>
        </div>
      </div>
    </div>
  )
}
