'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  // Setup Autoplay with a 3.5 second delay between slides
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', containScroll: 'trimSnaps', loop: true },
    [autoplay.current]
  )
  const { addToCart } = useCart()

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  // Smart Pause Logic: Stop on touch, resume 5 seconds after release
  const onPointerDown = useCallback(() => {
    autoplay.current.stop()
  }, [])

  const onPointerUp = useCallback(() => {
    setTimeout(() => {
      autoplay.current.play()
    }, 5000) // Wait 5 seconds before resuming
  }, [])

  return (
    // Added much more vertical margin (my-12) to separate the lists perfectly
    <div className="my-12">
      <div className="flex justify-between items-end mb-5 px-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-1.5"></div>
        </div>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="bg-white shadow-sm border border-gray-200 p-2.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">←</button>
          <button onClick={scrollNext} className="bg-white shadow-sm border border-gray-200 p-2.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">→</button>
        </div>
      </div>
      
      <div 
        className="overflow-hidden px-4 py-2" 
        ref={emblaRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Increased gap between cards */}
        <div className="flex gap-5">
          {products.map((product) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={product.id} 
              // Made cards wider (75% of screen) and taller
              className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 bg-white rounded-[2rem] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 relative group transition-all hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] hover:border-blue-100"
            >
              <div className="h-64 w-full bg-[#f4f6f9] rounded-3xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                {/* Little floating tag for Rx */}
                {product.is_prescription_required && (
                  <span className="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                    Rx
                  </span>
                )}
              </div>
              
              <div className="px-1">
                <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-1.5 truncate">
                  {product.categories?.name || 'Pharmacy'}
                </p>
                <h3 className="font-bold text-base text-gray-800 leading-tight mb-3 h-12 overflow-hidden line-clamp-2">{product.name}</h3>
                
                <div className="flex justify-between items-center mt-auto">
                  <p className="font-black text-2xl text-gray-900">${product.price.toFixed(2)}</p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={22} />
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
