'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) {
        onChange(data.url)
      } else {
        alert(data.error || 'Yükleme başarısız')
      }
    } catch {
      alert('Yükleme sırasında hata oluştu')
    }
    setUploading(false)
  }

  return (
    <div>
      {label && <p className="text-xs text-gray-500 mb-2 font-medium">📐 {label}</p>}
      <div
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl p-6 text-center cursor-pointer transition-all bg-gray-50 hover:bg-green-50"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-green-600">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm font-bold">Yükleniyor...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={28} className="text-gray-300" />
            <p className="text-sm font-bold text-gray-600">Sürükle bırak veya tıkla</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          className="hidden"
        />
      </div>
      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">veya URL gir</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"
      />
      {value ? (
        <div className="mt-3 relative h-32 rounded-xl overflow-hidden bg-gray-100 border border-green-200">
          <Image src={value} alt="Onizleme" fill className="object-cover" onError={() => onChange('')} />
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange('') }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 flex items-center gap-1">
            <ImageIcon size={11} /> Gorsel hazir
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
          <ImageIcon size={12} /> Henuz gorsel secilmedi
        </p>
      )}
    </div>
  )
}
