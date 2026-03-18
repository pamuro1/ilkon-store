'use client'
import { useState, useEffect, useCallback } from 'react'
import { CartItem, Product } from '@/types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try { const s = localStorage.getItem('ilkon-cart'); if (s) setItems(JSON.parse(s)) } catch {}
  }, [])

  const sync = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem('ilkon-cart', JSON.stringify(newItems))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const addItem = useCallback((product: Product, selectedColor?: string) => {
    setItems(prev => {
      // Aynı ürün + aynı renk varsa miktarı artır
      const exists = prev.find(i => i.product.id === product.id && i.selectedColor === selectedColor)
      const next = exists
        ? prev.map(i => (i.product.id === product.id && i.selectedColor === selectedColor) ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1, selectedColor }]
      localStorage.setItem('ilkon-cart', JSON.stringify(next))
      window.dispatchEvent(new Event('cart-updated'))
      return next
    })
  }, [])

  const removeItem = useCallback((id: number, selectedColor?: string) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.product.id === id && i.selectedColor === selectedColor))
      localStorage.setItem('ilkon-cart', JSON.stringify(next))
      window.dispatchEvent(new Event('cart-updated'))
      return next
    })
  }, [])

  const updateQuantity = useCallback((id: number, qty: number, selectedColor?: string) => {
    if (qty <= 0) { removeItem(id, selectedColor); return }
    setItems(prev => {
      const next = prev.map(i => (i.product.id === id && i.selectedColor === selectedColor) ? { ...i, quantity: qty } : i)
      localStorage.setItem('ilkon-cart', JSON.stringify(next))
      window.dispatchEvent(new Event('cart-updated'))
      return next
    })
  }, [removeItem])

  const clearCart = useCallback(() => { sync([]) }, [])

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, total, count }
}
