'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  // delay: 6000 (Pauses for 6 seconds)
  const autoplay = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start', 
      containScroll: 'trimSnaps', 
      loop: true,
      duration: 60 // HIGH DURATION = SLOW, LUXURIOUS GLIDE
    },
    [autoplay.current]
  )
  const { addToCart } = useCart()

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  const onPointerDown = useCallback(() => { autoplay.current.stop() }, [])
  const onPointerUp = useCallback(() => {
    setTimeout(() => { autoplay.current.play() }, 5000) // 5s pause after touch
  }, [])

  return (
    <div className="my-10">
      <div className="flex justify-between items-end mb-5 px-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight capitalize">{title}</h2>
          <div className="h-1 w-8 bg-blue-600 rounded-full mt-1.5"></div>
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
        <div className="flex gap-5">
          {products.map((product) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={product.id} 
              className="flex-[0_0_70%] sm:flex-[0_0_40%] md:flex-[0_0_28%] lg:flex-[0_0_20%] min-w-0 bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group transition-all hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:border-blue-100"
            >
              <div className="h-56 w-full bg-[#f4f6f9] rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center p-3">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
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
                <h3 className="font-bold text-base text-gray-800 leading-tight mb-2 h-12 overflow-hidden line-clamp-2">{product.name}</h3>
                
                <div className="flex justify-between items-center mt-auto pt-2">
                  <p className="font-black text-xl text-gray-900">${product.price.toFixed(2)}</p>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
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
