'use client'
import { useState, useEffect } from 'react'
import { Search, MapPin, ShoppingCart, User, Sparkles } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import CartDrawer from './CartDrawer'
import SmartSearchModal from './SmartSearchModal'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartCount } = useCart()
  const controls = useAnimation()

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
        
        {/* The New Smart Search Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-3 text-left hover:bg-white/20 transition-colors"
        >
          <Search size={18} className="text-blue-400 mr-3" />
          <span className="text-gray-400 text-sm flex-1">Search symptoms or medications...</span>
          <Sparkles size={16} className="text-yellow-400" />
        </button>

        <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400">
          <MapPin size={14} className="text-blue-400" />
          <span>Deliver to Nigeria</span>
        </div>
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SmartSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
