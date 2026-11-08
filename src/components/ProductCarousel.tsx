'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useRef } from 'react'
import ProductCard from './ProductCard'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  const autoplay = useRef(Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true }))
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', containScroll: 'trimSnaps', loop: true, duration: 70 }, 
    [autoplay.current]
  )

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  const onPointerDown = useCallback(() => { autoplay.current.stop() }, [])
  const onPointerUp = useCallback(() => { setTimeout(() => { autoplay.current.play() }, 5000) }, [])

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
      
      <div className="overflow-hidden px-4 py-2" ref={emblaRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="flex gap-5">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_72%] sm:flex-[0_0_42%] md:flex-[0_0_28%] lg:flex-[0_0_20%] min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
