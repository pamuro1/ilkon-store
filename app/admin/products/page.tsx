'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, ArrowLeft, Package, Star, Loader2, Trash2 } from 'lucide-react'

interface Product {
  id: number
  barcode: string
  name: string
  image_url: string
  price: number
  category_name?: string
  parent_category_name?: string
  is_popular: boolean
  is_new: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchProducts = async () => {
    try {
      const r = await fetch('/api/admin/products')
      const d = await r.json()
      setProducts(d.products || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        const d = await res.json().catch(() => ({}))
        alert('Silme hatası: ' + (d.error || res.status))
      }
    } catch {
      alert('Bağlantı hatası')
    }
    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-green-200 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-black text-xl">Ürün Yönetimi</h1>
        {!loading && (
          <span className="bg-green-600 text-green-100 text-xs px-2 py-0.5 rounded-full">
            {products.length} ürün
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            🔄 Yenile
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-white text-green-700 font-bold px-4 py-2 rounded-xl hover:bg-green-50 text-sm"
          >
            <Plus size={16} /> Yeni Ürün
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-green-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <Package size={56} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold mb-4">Henüz ürün eklenmemiş</p>
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700">
              <Plus size={18} /> İlk Ürünü Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Ürün</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Barkod</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Fiyat</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Durum</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            {p.image_url
                              ? <Image src={p.image_url} alt={p.name} width={48} height={48} className="w-full h-full object-contain p-1" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20} /></div>}
                          </div>
                          <p className="font-semibold text-gray-800 text-sm line-clamp-2 max-w-xs">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.barcode || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-lg">
                          {p.parent_category_name ? `${p.parent_category_name} › ` : ''}{p.category_name || 'Kategorisiz'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-700 whitespace-nowrap">
                        {Number(p.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {p.is_popular && (
                            <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star size={10} fill="currentColor" /> Popüler
                            </span>
                          )}
                          {p.is_new && (
                            <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">Yeni</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/products/${p.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === p.id
                              ? <Loader2 size={15} className="animate-spin" />
                              : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
