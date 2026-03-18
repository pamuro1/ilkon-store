'use client'
import { useState } from 'react'

const COLORS: Record<string, { bg: string; ring: string; label: string; textDark: boolean }> = {
  beyaz:    { bg: '#ffffff', ring: '#d1d5db', label: 'Beyaz', textDark: true },
  siyah:    { bg: '#111827', ring: '#111827', label: 'Siyah', textDark: false },
  kirmizi:  { bg: '#ef4444', ring: '#ef4444', label: 'Kırmızı', textDark: false },
  mavi:     { bg: '#3b82f6', ring: '#3b82f6', label: 'Mavi', textDark: false },
  turuncu:  { bg: '#f97316', ring: '#f97316', label: 'Turuncu', textDark: false },
  yesil:    { bg: '#22c55e', ring: '#22c55e', label: 'Yeşil', textDark: false },
  pembe:    { bg: '#f472b6', ring: '#f472b6', label: 'Pembe', textDark: false },
  gri:      { bg: '#9ca3af', ring: '#9ca3af', label: 'Gri', textDark: false },
  sari:     { bg: '#facc15', ring: '#ca8a04', label: 'Sarı', textDark: true },
  mor:      { bg: '#a855f7', ring: '#a855f7', label: 'Mor', textDark: false },
  bej:      { bg: '#fef3c7', ring: '#d97706', label: 'Bej', textDark: true },
  lacivert: { bg: '#1e3a8a', ring: '#1e3a8a', label: 'Lacivert', textDark: false },
}

interface Props {
  colors: string
  onColorChange?: (color: string) => void
}

export default function ProductColors({ colors, onColorChange }: Props) {
  const list = colors.split(',').map(c => c.trim()).filter(c => COLORS[c])
  const [selected, setSelected] = useState(list[0] || '')

  if (list.length === 0) return null

  const handleSelect = (color: string) => {
    setSelected(color)
    onColorChange?.(color)
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-700 text-sm">Renk Seçeneği</h3>
        {selected && (
          <span className="text-sm font-semibold text-gray-600">{COLORS[selected]?.label}</span>
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        {list.map(color => {
          const info = COLORS[color]
          const isSelected = selected === color
          return (
            <button key={color} onClick={() => handleSelect(color)} title={info.label}
              style={{
                backgroundColor: info.bg,
                outline: isSelected ? `3px solid ${info.ring}` : undefined,
                outlineOffset: isSelected ? '3px' : undefined,
                border: color === 'beyaz' || color === 'bej' ? '1.5px solid #e5e7eb' : 'none',
              }}
              className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                isSelected ? 'scale-110 shadow-md' : 'hover:scale-105 hover:shadow-sm'
              }`}>
              {isSelected && (
                <span style={{ color: info.textDark ? '#374151' : '#ffffff' }} className="text-xs font-black">✓</span>
              )}
            </button>
          )
        })}
      </div>
      {list.length > 1 && (
        <p className="text-xs text-gray-400 mt-2">Renk seçmek için dairelere tıklayın</p>
      )}
    </div>
  )
}
