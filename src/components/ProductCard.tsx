'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Heart, Check, Tag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const hasDiscount = product.discount_price !== null && product.discount_price > 0;
  const finalPrice = hasDiscount ? product.discount_price : product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    // Add the discounted price to the cart
    addToCart({ ...product, price: finalPrice })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)] hover:border-blue-100 flex flex-col h-full"
    >
      <div className="h-48 w-full bg-[#f4f6f9] rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center p-3">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
        
        <motion.button 
          whileTap={{ scale: 0.7 }}
          onClick={toggleWishlist}
          className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </motion.button>

        {/* Sale Badge */}
        {hasDiscount && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 text-[10px] bg-green-500 text-white px-2.5 py-1 rounded-full font-black shadow-sm flex items-center gap-1">
            <Tag size={10} /> SALE
          </motion.span>
        )}

        {product.is_prescription_required && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-2 right-2 text-[10px] bg-red-500 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
            Rx
          </motion.span>
        )}
      </div>
      
      <div className="px-1 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-1.5 truncate">
            {product.categories?.name || 'Pharmacy'}
          </p>
          <h3 className="font-bold text-base text-gray-800 leading-tight mb-2 line-clamp-2">{product.name}</h3>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            {hasDiscount && <p className="text-xs text-gray-400 line-through mb-0.5">${product.price.toFixed(2)}</p>}
            <p className={`font-black text-xl ${hasDiscount ? 'text-green-600' : 'text-gray-900'}`}>${finalPrice.toFixed(2)}</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleAdd}
            className={`p-3 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-center ${
              addedId === product.id ? 'bg-green-500 shadow-green-500/30 text-white' : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 text-white'
            }`}
          >
            <AnimatePresence mode="wait">
              {addedId === product.id ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={20} /></motion.div>
              ) : (
                <motion.div key="plus" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}><Plus size={20} /></motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
