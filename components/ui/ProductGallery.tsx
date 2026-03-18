'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 flex items-center justify-center h-96">
        <div className="text-center text-gray-200">
          <div className="text-6xl mb-2">📦</div>
          <p className="text-sm">Görsel yok</p>
        </div>
      </div>
    )
  }

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx(i => (i + 1) % images.length)

  return (
    <div className="flex flex-col gap-3">
      {/* Ana görsel */}
      <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden group" style={{ height: '420px' }}>
        <img
          src={images[activeIdx]}
          alt={`${productName} - ${activeIdx + 1}`}
          className="w-full h-full object-contain p-6 cursor-zoom-in"
          onClick={() => setZoomed(true)}
        />

        {/* Zoom ikonu */}
        <button
          onClick={() => setZoomed(true)}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn size={18} />
        </button>

        {/* Ok butonları - birden fazla görsel varsa */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Görsel sayacı */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail'lar - birden fazla görsel varsa */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                i === activeIdx
                  ? 'border-green-500 shadow-md scale-105'
                  : 'border-gray-200 hover:border-green-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} ${i + 1}`} className="w-full h-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            <img
              src={images[activeIdx]}
              alt={productName}
              className="w-full h-full object-contain max-h-screen"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
            >
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
