'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
  const { addToCart } = useCart()

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  return (
    <div className="my-6 px-4">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
        </div>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="bg-white shadow-sm border p-2 rounded-full hover:bg-gray-50 text-gray-600">←</button>
          <button onClick={scrollNext} className="bg-white shadow-sm border p-2 rounded-full hover:bg-gray-50 text-gray-600">→</button>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <motion.div 
              whileTap={{ scale: 0.97 }}
              key={product.id} 
              className="flex-[0_0_48%] md:flex-[0_0_25%] min-w-0 bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group"
            >
              <div className="h-44 w-full bg-[#f8f9fa] rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              <div className="px-1">
                <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider mb-1 truncate">
                  {product.categories?.name || 'Pharmacy'}
                </p>
                <h3 className="font-bold text-sm text-gray-800 leading-tight mb-2 h-10 overflow-hidden">{product.name}</h3>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="font-extrabold text-lg text-gray-900">${product.price.toFixed(2)}</p>
                  
                  {/* Floating Add Button */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => addToCart(product)}
                    className="bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
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
