'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  return (
    <div className="my-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">←</button>
          <button onClick={scrollNext} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">→</button>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_45%] md:flex-[0_0_23%] min-w-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="h-40 w-full bg-gray-50 rounded-xl overflow-hidden mb-3">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <p className="font-bold text-lg mt-1 text-blue-600">${product.price}</p>
              {product.is_prescription_required && (
                <span className="inline-block mt-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  Rx Required
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
