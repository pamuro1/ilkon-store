'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Save, X, Loader2, Upload, ImageIcon } from 'lucide-react'
import { Product, Category } from '@/types'

interface Props { product?: Product; categories: Category[] }

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imgPreview, setImgPreview] = useState(product?.image_url || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    barcode: product?.barcode || '',
    name: product?.name || '',
    image_url: product?.image_url || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category_id: product?.category_id?.toString() || '',
    is_popular: product?.is_popular || false,
    is_new: product?.is_new ?? true,
    colors: product?.colors || '',
  })

  const parents = categories.filter(c => !c.parent_id)
  const children = categories.filter(c => c.parent_id)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm(p => ({ ...p, [name]: val }))
    if (name === 'image_url') setImgPreview(value)
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) {
        setForm(p => ({ ...p, image_url: data.url }))
        setImgPreview(data.url)
      } else {
        alert(data.error || 'Yükleme başarısız')
      }
    } catch {
      alert('Yükleme sırasında hata oluştu')
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          category_id: form.category_id ? parseInt(form.category_id) : null,
          colors: form.colors,
        }),
      })
      if (res.ok) { window.location.href = '/admin/products' }
      else { const d = await res.json(); alert(d.error || 'Hata oluştu') }
    } catch { alert('Sunucu hatası') }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Barkod</label>
          <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="1234567890123"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Fiyat (₺) *</label>
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="0.00" required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Ürün Adı *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ürün adını girin" required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori</label>
          <select name="category_id" value={form.category_id} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm bg-white">
            <option value="">Kategori Seçin</option>
            {parents.map(p => (
              <optgroup key={p.id} label={`── ${p.name}`}>
                {children.filter(c => c.parent_id === p.id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                <option value={p.id}>↪ {p.name} (Genel)</option>
              </optgroup>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Ürün Görseli</label>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl p-8 text-center cursor-pointer transition-all bg-gray-50 hover:bg-green-50 mb-3"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm font-bold">Yükleniyor...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={32} className="text-gray-300" />
                <p className="text-sm font-bold text-gray-600">Görseli sürükle bırak veya tıkla</p>
                <p className="text-xs">JPG, PNG, WebP · Maksimum 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]) }}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">veya URL yapıştır</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />

          {imgPreview ? (
            <div className="mt-3 flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="relative w-24 h-24 bg-white rounded-xl border border-green-200 overflow-hidden flex-shrink-0">
                <Image src={imgPreview} alt="Önizleme" fill className="object-contain p-1" onError={() => setImgPreview('')} />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-xs font-bold text-green-700 mb-1">✅ Görsel yüklendi</p>
                <p className="text-xs text-gray-400 break-all">{imgPreview.length > 50 ? imgPreview.slice(0, 50) + '...' : imgPreview}</p>
                <button type="button" onClick={() => { setImgPreview(''); setForm(p => ({ ...p, image_url: '' })) }}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 font-semibold">
                  <X size={11} /> Görseli kaldır
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-400 flex items-center gap-1"><ImageIcon size={13} /> Henüz görsel seçilmedi</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Ürün Özellikleri / Açıklama</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Ürün özellikleri, teknik detaylar..." rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm resize-none" />
        </div>


        {/* Renk Seçenekleri */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={form.colors !== ''}
              onChange={e => setForm(p => ({ ...p, colors: e.target.checked ? 'beyaz' : '' }))}
              className="w-5 h-5 accent-green-600"
            />
            <span className="text-sm font-bold text-gray-700">🎨 Renk Seçenekleri Ekle</span>
          </label>
          {form.colors !== '' && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Ürün sayfasında gösterilecek renkleri seçin:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Beyaz', val: 'beyaz', bg: 'bg-white border border-gray-300', text: 'text-gray-700' },
                  { name: 'Siyah', val: 'siyah', bg: 'bg-gray-900', text: 'text-white' },
                  { name: 'Kırmızı', val: 'kirmizi', bg: 'bg-red-500', text: 'text-white' },
                  { name: 'Mavi', val: 'mavi', bg: 'bg-blue-500', text: 'text-white' },
                  { name: 'Turuncu', val: 'turuncu', bg: 'bg-orange-500', text: 'text-white' },
                  { name: 'Yeşil', val: 'yesil', bg: 'bg-green-500', text: 'text-white' },
                  { name: 'Pembe', val: 'pembe', bg: 'bg-pink-400', text: 'text-white' },
                  { name: 'Gri', val: 'gri', bg: 'bg-gray-400', text: 'text-white' },
                  { name: 'Sarı', val: 'sari', bg: 'bg-yellow-400', text: 'text-gray-700' },
                  { name: 'Mor', val: 'mor', bg: 'bg-purple-500', text: 'text-white' },
                  { name: 'Bej', val: 'bej', bg: 'bg-amber-100 border border-amber-300', text: 'text-gray-700' },
                  { name: 'Lacivert', val: 'lacivert', bg: 'bg-blue-900', text: 'text-white' },
                ].map(color => {
                  const selected = form.colors.split(',').filter(Boolean).includes(color.val)
                  return (
                    <button key={color.val} type="button"
                      onClick={() => {
                        const curr = form.colors.split(',').filter(Boolean)
                        const next = selected ? curr.filter(c => c !== color.val) : [...curr, color.val]
                        setForm(p => ({ ...p, colors: next.join(',') }))
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        selected ? 'border-green-500 shadow-sm scale-105' : 'border-transparent hover:border-gray-300'
                      } ${color.bg} ${color.text}`}>
                      {color.name} {selected && '✓'}
                    </button>
                  )
                })}
              </div>
              {form.colors && (
                <p className="text-xs text-gray-500 mt-2">Seçili: <span className="font-semibold">{form.colors.split(',').filter(Boolean).join(', ')}</span></p>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="is_popular" checked={form.is_popular} onChange={handleChange} className="w-5 h-5 accent-green-600" />
            <span className="text-sm font-semibold text-gray-700">⭐ Popüler Ürün (Ana sayfada görünür)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} className="w-5 h-5 accent-green-600" />
            <span className="text-sm font-semibold text-gray-700">✨ Yeni Ürün</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <button type="submit" disabled={loading || uploading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {product ? 'Güncelle' : 'Ürünü Kaydet'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl hover:border-gray-300 transition-colors">
          <X size={18} /> İptal
        </button>
      </div>
    </form>
  )
}
