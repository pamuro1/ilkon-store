export const dynamic = 'force-dynamic'
export const revalidate = 0

import { notFound } from 'next/navigation'
import { Tag, Barcode } from 'lucide-react'
import Link from 'next/link'
import { sql } from '@/lib/db'
import { Product } from '@/types'
import ProductPageClient from './ProductPageClient'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const r = await sql`
      SELECT p.*, c.name as category_name, pc.name as parent_category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      LEFT JOIN categories pc ON c.parent_id=pc.id 
      WHERE p.id=${parseInt(id)}`
    return r.rows[0] as Product || null
  } catch { return null }
}

async function getImages(productId: number) {
  try {
    const r = await sql`SELECT * FROM product_images WHERE product_id=${productId} ORDER BY order_index ASC`
    return r.rows as { id: number; image_url: string }[]
  } catch { return [] }
}

async function getRelated(p: Product) {
  try {
    const r = await sql`
      SELECT p.*, c.name as category_name FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      WHERE p.category_id=${p.category_id} AND p.id!=${p.id} LIMIT 4`
    return r.rows as Product[]
  } catch { return [] }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const [extraImages, related] = await Promise.all([getImages(product.id), getRelated(product)])
  const allImages = [...(product.image_url ? [product.image_url] : []), ...extraImages.map(i => i.image_url)]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-green-600">Ana Sayfa</Link>
        <span>/</span>
        {product.parent_category_name && (
          <><Link href={`/kategori/${product.parent_category_name.toLowerCase()}`} className="hover:text-green-600">{product.parent_category_name}</Link><span>/</span></>
        )}
        {product.category_name && (
          <><Link href={`/kategori/${product.category_name.toLowerCase()}`} className="hover:text-green-600">{product.category_name}</Link><span>/</span></>
        )}
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      {/* Client component - renk state'i burada yönetilir */}
      <ProductPageClient product={product} images={allImages} related={related} />
    </div>
  )
}
