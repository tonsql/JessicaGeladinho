import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'jessica-gourmet-cart'

export function useCart() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const add = (product) => {
    if ((product.stock ?? 1) <= 0) return
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + 1, product.stock ?? 99)
        return current.map((item) => item.id === product.id ? { ...item, quantity: nextQuantity } : item)
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const decrement = (id) => setItems((current) => current.flatMap((item) => {
    if (item.id !== id) return [item]
    return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
  }))

  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const clear = () => setItems([])
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items])

  return { items, add, decrement, remove, clear, count, total }
}
