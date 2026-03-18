export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { sql, getCategories } from '@/lib/db'
import { Product, Category } from '@/types'
import ProductForm from '../../ProductForm'
import ProductImagesManager from '../../ProductImagesManager'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product: Product | null = null
  let categories: Category[] = []
  try {
    const [pr, cr] = await Promise.all([
      sql`SELECT * FROM products WHERE id=${parseInt(params.id)}`,
      getCategories(),
    ])
    product = pr.rows[0] as Product || null
    categories = cr.rows as Category[]
  } catch {}

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/products" className="text-green-200 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="font-black text-xl">Ürünü Düzenle</h1>
        <span className="text-green-200 text-sm">#{product.id} · {product.name}</span>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Ana bilgiler */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-black text-gray-800 text-lg mb-6">Ürün Bilgileri</h2>
          <ProductForm product={product} categories={categories} />
        </div>
        {/* Ek görseller */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-black text-gray-800 text-lg mb-2">Ek Görseller</h2>
          <p className="text-gray-500 text-sm mb-6">Ana görsel dışında max 4 ek görsel ekleyebilirsiniz. Ürün sayfasında galeri olarak gösterilir.</p>
          <ProductImagesManager productId={product.id} />
        </div>
      </div>
    </div>
  )
}
