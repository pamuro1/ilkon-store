'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import { showToast } from '@/components/ui/Toast'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    showToast(`${product.name} sepete eklendi!`)
  }

  return (
    <div className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col group">
      <Link href={`/products/${product.id}`} className="card-img relative block h-52 bg-gray-50">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-contain p-4" sizes="(max-width:768px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_popular && <span className="bg-amber-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">⭐ Popüler</span>}
          {product.is_new && <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Yeni</span>}
        </div>
        <div className="absolute inset-0 bg-green-900/0 group-hover:bg-green-900/8 transition-all flex items-center justify-center">
          <span className="bg-white text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shadow-md">
            <Eye size={12} /> İncele
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        {product.category_name && (
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">
            {product.parent_category_name ? `${product.parent_category_name} › ` : ''}{product.category_name}
          </p>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-gray-800 font-bold text-sm leading-snug mb-2 hover:text-green-700 transition-colors line-clamp-2 min-h-[2.4rem]">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{product.description}</p>
        )}
        <div className="mt-auto">
          <p className="text-green-700 font-black text-xl mb-3">
            {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
          <button onClick={handleAdd} className="add-btn w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-md">
            <ShoppingCart size={15} /> Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  )
}
