export const dynamic = 'force-dynamic'
export const revalidate = 0

import { sql } from '@/lib/db'
import { Product } from '@/types'
import ProductCard from '@/components/ui/ProductCard'
import { Search, Package } from 'lucide-react'
import Link from 'next/link'

async function searchProducts(q: string): Promise<Product[]> {
  if (!q.trim()) return []
  try {
    const r = await sql`
      SELECT p.*, c.name as category_name, pc.name as parent_category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id=c.id
      LEFT JOIN categories pc ON c.parent_id=pc.id
      WHERE p.name ILIKE ${'%' + q + '%'} OR p.description ILIKE ${'%' + q + '%'} OR p.barcode ILIKE ${'%' + q + '%'}
      ORDER BY p.created_at DESC LIMIT 48`
    return r.rows as Product[]
  } catch { return [] }
}

export default async function AramaPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || ''
  const products = await searchProducts(q)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Search size={24} className="text-green-600" />
        <h1 className="text-2xl font-black text-gray-800">{q ? `"${q}" için sonuçlar` : 'Arama'}</h1>
      </div>
      {q && <p className="text-gray-500 mb-6 text-sm">{products.length > 0 ? `${products.length} ürün bulundu` : 'Sonuç bulunamadı'}</p>}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : q ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-20 text-center">
          <Package size={64} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg mb-4">"{q}" için ürün bulunamadı</p>
          <Link href="/" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700">Ana Sayfaya Dön</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 py-20 text-center">
          <Search size={64} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Aramak istediğiniz ürünü yazın</p>
        </div>
      )}
    </div>
  )
}
