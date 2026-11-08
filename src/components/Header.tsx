'use client'
import { useState } from 'react'
import { Search, MapPin, ShoppingCart, User } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import CartDrawer from './CartDrawer'
import { useEffect } from 'react'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount } = useCart()
  const controls = useAnimation()

  // Bounce the cart icon when count changes
  useEffect(() => {
    if (cartCount > 0) {
      controls.start({ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.4 } })
    }
  }, [cartCount, controls])

  return (
    <>
      <div className="bg-[#0f172a]/95 backdrop-blur-md text-white p-4 sticky top-0 z-50 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">DASWAM</h1>
          <div className="flex gap-4 items-center">
            <User size={22} className="text-gray-300" />
            
            <button onClick={() => setIsCartOpen(true)} className="relative p-1">
              <motion.div animate={controls}>
                <ShoppingCart size={24} className="text-white" />
              </motion.div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0f172a]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden p-1">
          <div className="pl-3 text-gray-400"><Search size={18} /></div>
          <input type="text" placeholder="Search medications..." className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 outline-none text-sm" />
        </div>

        <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400">
          <MapPin size={14} className="text-blue-400" />
          <span>Deliver to Nigeria</span>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
