'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Heart, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  // Very slow pace: 6.5s pause
  const autoplay = useRef(Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true }))
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', containScroll: 'trimSnaps', loop: true, duration: 70 }, // 70 = very smooth slow glide
    [autoplay.current]
  )
  const { addToCart } = useCart()
  
  // Track "Added to cart" state for micro-interaction feedback
  const [addedId, setAddedId] = useState<string | null>(null)
  // Track wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  const onPointerDown = useCallback(() => { autoplay.current.stop() }, [])
  const onPointerUp = useCallback(() => {
    setTimeout(() => { autoplay.current.play() }, 5000)
  }, [])

  const handleAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // prevent card tap
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500) // Reset after 1.5s
  }

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(id)) newWishlist.delete(id)
    else newWishlist.add(id)
    setWishlist(newWishlist)
  }

  return (
    <div className="my-10">
      <div className="flex justify-between items-end mb-5 px-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight capitalize">{title}</h2>
          {/* Micro-interaction: Animated underline */}
          <motion.div 
            initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.8 }}
            className="h-1 bg-blue-600 rounded-full mt-1.5"
          />
        </div>
        <div className="flex gap-2">
          {/* Micro-interaction: Hover lift & press scale on arrows */}
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} onClick={scrollPrev} className="bg-white shadow-sm border border-gray-200 p-2.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">←</motion.button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} onClick={scrollNext} className="bg-white shadow-sm border border-gray-200 p-2.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">→</motion.button>
        </div>
      </div>
      
      <div className="overflow-hidden px-4 py-2" ref={emblaRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="flex gap-5">
          {products.map((product) => (
            <motion.div 
              whileHover={{ y: -5 }} // Micro-interaction: Card lift
              whileTap={{ scale: 0.98 }} // Micro-interaction: Card press
              key={product.id} 
              className="flex-[0_0_72%] sm:flex-[0_0_42%] md:flex-[0_0_28%] lg:flex-[0_0_20%] min-w-0 bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)] hover:border-blue-100"
            >
              <div className="h-56 w-full bg-[#f4f6f9] rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center p-3">
                {/* Micro-interaction: Image zoom on hover */}
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                
                {/* Wishlist Heart */}
                <motion.button 
                  whileTap={{ scale: 0.7 }}
                  onClick={(e) => toggleWishlist(e, product.id)}
                  className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={16} className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : ""} />
                </motion.button>

                {product.is_prescription_required && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-2.5 py-1 rounded-full font-bold shadow-sm"
                  >
                    Rx
                  </motion.span>
                )}
              </div>
              
              <div className="px-1">
                <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-1.5 truncate">
                  {product.categories?.name || 'Pharmacy'}
                </p>
                <h3 className="font-bold text-base text-gray-800 leading-tight mb-2 h-12 overflow-hidden line-clamp-2">{product.name}</h3>
                
                <div className="flex justify-between items-center mt-auto pt-2">
                  {/* Micro-interaction: Price pop */}
                  <motion.p 
                    key={product.price}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="font-black text-xl text-gray-900"
                  >
                    ${product.price.toFixed(2)}
                  </motion.p>
                  
                  {/* Add to Cart Button (Morphing Micro-interaction) */}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleAdd(e, product)}
                    className={`p-3 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-center ${
                      addedId === product.id 
                        ? 'bg-green-500 shadow-green-500/30 text-white' 
                        : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {addedId === product.id ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check size={20} />
                        </motion.div>
                      ) : (
                        <motion.div key="plus" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                          <Plus size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
