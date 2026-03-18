export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/lib/db'
import { Category } from '@/types'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  let categories: Category[] = []
  try { const r = await getCategories(); categories = r.rows as Category[] } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/products" className="text-green-200 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="font-black text-xl">Yeni Ürün Ekle</h1>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <ProductForm categories={categories} />
        </div>
      </div>
    </div>
  )
}
