'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function DeleteBtn({ productId, productName }: { productId: number; productName: string }) {
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const d = await res.json().catch(() => ({}))
        alert('Silme hatası: ' + (d.error || res.status))
        setLoading(false)
      }
    } catch (err) {
      alert('Bağlantı hatası')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Sil"
    >
      {loading
        ? <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-red-300 border-t-transparent rounded-full" />
        : <Trash2 size={15} />}
    </button>
  )
}
