'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type Product = { id: string; name: string; price: number; image_url: string }
type CartItem = Product & { quantity: number }

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from local storage on first render
  useEffect(() => {
    const saved = localStorage.getItem('daswam_cart')
    if (saved) setCart(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  // Save to local storage when cart changes
  useEffect(() => {
    if (isLoaded) localStorage.setItem('daswam_cart', JSON.stringify(cart))
  }, [cart, isLoaded])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
