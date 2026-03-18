export const dynamic = 'force-dynamic'
export const revalidate = 0

import { sql } from '@/lib/db'
import { Product, Category } from '@/types'
import ProductCard from '@/components/ui/ProductCard'
import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'

async function getCat(slug: string): Promise<Category | null> {
  try {
    const r = await sql`SELECT c.*, pc.name as parent_name FROM categories c LEFT JOIN categories pc ON c.parent_id=pc.id WHERE c.slug=${slug}`
    return r.rows[0] as Category || null
  } catch { return null }
}

async function getProds(catId: number): Promise<Product[]> {
  try {
    const r = await sql`SELECT p.*, c.name as category_name, pc.name as parent_category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN categories pc ON c.parent_id=pc.id WHERE p.category_id=${catId} OR c.parent_id=${catId} ORDER BY p.created_at DESC`
    return r.rows as Product[]
  } catch { return [] }
}

async function getSubs(parentId: number): Promise<Category[]> {
  try {
    const r = await sql`SELECT * FROM categories WHERE parent_id=${parentId} ORDER BY name`
    return r.rows as Category[]
  } catch { return [] }
}

export default async function KategoriPage({ params }: { params: { slug: string } }) {
  const cat = await getCat(params.slug)
  const products = cat ? await getProds(cat.id) : []
  const subs = cat ? await getSubs(cat.id) : []
  const title = cat?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Ana Sayfa</Link>
        <ChevronRight size={14} />
        {cat?.parent_name && <><span>{cat.parent_name}</span><ChevronRight size={14} /></>}
        <span className="text-gray-800 font-semibold">{title}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-800">{title}</h1>
        <span className="text-gray-500 text-sm">{products.length} ürün</span>
      </div>

      {subs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {subs.map(s => (
            <Link key={s.id} href={`/kategori/${s.slug}`} className="bg-white border-2 border-gray-200 hover:border-green-500 hover:text-green-700 text-gray-600 font-semibold text-sm px-4 py-2 rounded-xl transition-all">
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-20 text-center">
          <Package size={64} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold text-lg mb-6">Bu kategoride ürün bulunamadı</p>
          <Link href="/" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700">Ana Sayfaya Dön</Link>
        </div>
      )}
    </div>
  )
}
