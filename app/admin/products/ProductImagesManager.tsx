'use client'
import { useState, useEffect, useRef } from 'react'
import { Trash2, Upload, Loader2, Plus } from 'lucide-react'

interface ProductImage {
  id: number
  image_url: string
  order_index: number
}

export default function ProductImagesManager({ productId }: { productId: number }) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    try {
      const r = await fetch(`/api/admin/products/${productId}/images`)
      const d = await r.json()
      setImages(d.images || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchImages() }, [productId])

  const handleUpload = async (file: File) => {
    if (images.length >= 4) {
      alert('Maksimum 4 ek görsel ekleyebilirsiniz')
      return
    }
    setUploading(true)
    try {
      // Önce Blob'a yükle
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) { alert(uploadData.error || 'Yükleme başarısız'); setUploading(false); return }

      // Sonra DB'ye kaydet
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: uploadData.url, order_index: images.length }),
      })
      if (res.ok) {
        fetchImages()
      } else {
        const d = await res.json()
        alert(d.error || 'Kaydetme başarısız')
      }
    } catch { alert('Hata oluştu') }
    setUploading(false)
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return
    try {
      await fetch(`/api/admin/products/${productId}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId }),
      })
      setImages(prev => prev.filter(i => i.id !== imageId))
    } catch { alert('Silme başarısız') }
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={28} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50" style={{ height: '120px' }}>
              <img src={img.image_url} alt={`Görsel ${i + 1}`} className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                {i + 1}
              </div>
            </div>
          ))}

          {/* Ekle butonu */}
          {images.length < 4 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 bg-gray-50 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-green-600 disabled:opacity-50"
              style={{ height: '120px' }}
            >
              {uploading
                ? <Loader2 size={24} className="animate-spin text-green-500" />
                : <>
                    <Plus size={24} />
                    <span className="text-xs font-semibold">Görsel Ekle</span>
                    <span className="text-xs text-gray-300">{4 - images.length} hak kaldı</span>
                  </>
              }
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = '' }}
        className="hidden"
      />

      {images.length === 0 && !loading && (
        <p className="text-gray-400 text-sm mt-3">
          💡 Ek görsel eklemek için yukarıdaki butona tıklayın. Görseller ürün sayfasında galeri olarak gösterilir.
        </p>
      )}
    </div>
  )
}
