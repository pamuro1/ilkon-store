'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft, Package } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function SepetPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
    </div>
  )

  const handleWA = () => {
    if (!items.length) return
    const lines = items.map(i => `• ${i.product.name}${i.selectedColor ? ` (Renk: ${i.selectedColor})` : ''} (Adet: ${i.quantity}) - ${(Number(i.product.price) * i.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`).join('\n')
    const msg = `Merhaba, web siteniz üzerinden sipariş vermek istiyorum.\n\n🛒 *SİPARİŞ LİSTESİ:*\n${lines}\n\n💰 *TOPLAM: ${total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}*\n\nBilgi verir misiniz?`
    window.open(`https://wa.me/905428520351?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (!items.length) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100">
        <ShoppingCart size={64} className="text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-gray-700 mb-2">Sepetiniz boş</h1>
        <p className="text-gray-400 mb-8">Ürün eklemek için alışverişe devam edin.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700">
          <ArrowLeft size={18} /> Alışverişe Devam Et
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-400 hover:text-green-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-black text-gray-800">Sepetim</h1>
        <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">{count} Ürün</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
              <div className="relative w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                {item.product.image_url
                  ? <Image src={item.product.image_url} alt={item.product.name} fill className="object-contain p-1" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={28} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                  {item.selectedColor && (
                    <p className="text-xs text-gray-500 mb-1">🎨 Renk: <span className="font-semibold capitalize">{item.selectedColor}</span></p>
                  )}
                <p className="text-green-700 font-bold">{Number(item.product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)} className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 transition-colors"><Minus size={13} /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)} className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 transition-colors"><Plus size={13} /></button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-xs text-gray-400 mb-1">Toplam</p>
                <p className="font-black text-gray-800">{(Number(item.product.price) * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </div>
              <button onClick={() => removeItem(item.product.id, item.selectedColor)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={17} /></button>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 mt-2"><Trash2 size={13} /> Sepeti Temizle</button>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-black text-gray-800 text-lg mb-4 pb-4 border-b border-gray-100">Sipariş Özeti</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 line-clamp-1 flex-1 mr-2">{item.product.name} x{item.quantity}</span>
                  <span className="font-semibold whitespace-nowrap">{(Number(item.product.price) * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-gray-800 text-lg">Toplam</span>
                <span className="font-black text-green-700 text-2xl">{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">🚚 Kargo ücretsiz</p>
            </div>
            <button onClick={handleWA} className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-3 text-base">
              <MessageCircle size={22} /> WhatsApp ile Sipariş Ver
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Sipariş detayları WhatsApp'a iletilecektir</p>
            <Link href="/" className="mt-4 w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:border-green-400 hover:text-green-600 flex items-center justify-center gap-2 text-sm transition-colors">
              <ArrowLeft size={15} /> Alışverişe Devam
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
