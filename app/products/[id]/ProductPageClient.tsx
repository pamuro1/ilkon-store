'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Tag, Barcode } from 'lucide-react'
import { Product } from '@/types'
import AddToCartButton from '@/components/ui/AddToCartButton'
import ProductColors from '@/components/ui/ProductColors'
import ProductGallery from '@/components/ui/ProductGallery'

interface Props {
  product: Product
  images: string[]
  related: Product[]
}

export default function ProductPageClient({ product, images, related }: Props) {
  // İlk rengi varsayılan seç
  const firstColor = product.colors
    ? product.colors.split(',').map(c => c.trim()).filter(Boolean)[0] || ''
    : ''
  const [selectedColor, setSelectedColor] = useState(firstColor)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Görsel galerisi */}
        <ProductGallery images={images} productName={product.name} />

        {/* Ürün bilgileri */}
        <div>
          <div className="flex gap-2 mb-3">
            {product.is_popular && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">⭐ Popüler</span>}
            {product.is_new && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✨ Yeni</span>}
          </div>

          {product.category_name && (
            <p className="text-green-600 font-semibold text-sm mb-2">
              <Tag size={12} className="inline mr-1"/>
              {product.parent_category_name ? `${product.parent_category_name} › ` : ''}{product.category_name}
            </p>
          )}

          <h1 className="text-3xl font-black text-gray-800 mb-4 leading-tight">{product.name}</h1>

          {product.barcode && (
            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
              <Barcode size={13}/> Barkod: {product.barcode}
            </p>
          )}

          <div className="text-4xl font-black text-green-700 mb-6">
            {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>

          {/* Renk seçici - onColorChange ile seçimi yukarı bildirir */}
          {product.colors && product.colors.trim() && (
            <ProductColors
              colors={product.colors}
              onColorChange={setSelectedColor}
            />
          )}

          {product.description && (
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">Ürün Açıklaması</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Seçilen renk AddToCartButton'a geçiyor */}
          <AddToCartButton
            product={product}
            selectedColor={selectedColor || undefined}
          />
          <p className="text-xs text-gray-400 mt-3 text-center">🚚 Ücretsiz kargo · WhatsApp ile sipariş</p>
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(p => (
              <Link key={p.id} href={`/products/${p.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow group">
                <div className="relative h-32 mb-3 bg-gray-50 rounded-xl overflow-hidden">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"/>
                    : <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">📦</div>}
                </div>
                <p className="text-sm font-semibold text-gray-700 line-clamp-2 mb-1">{p.name}</p>
                <p className="text-green-700 font-bold">{Number(p.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
