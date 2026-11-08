'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])

  return (
    <div className="my-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="bg-white border border-gray-200 shadow-sm p-2 rounded-full hover:bg-gray-50 text-gray-600">←</button>
          <button onClick={scrollNext} className="bg-white border border-gray-200 shadow-sm p-2 rounded-full hover:bg-gray-50 text-gray-600">→</button>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_45%] md:flex-[0_0_23%] min-w-0 bg-white rounded-2xl p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-40 w-full bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              {/* Show Category Name small */}
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1 truncate">
                {product.categories?.name || 'Pharmacy'}
              </p>
              <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1 h-10 overflow-hidden">{product.name}</h3>
              <p className="font-extrabold text-lg text-gray-900">${product.price.toFixed(2)}</p>
              
              {product.is_prescription_required && (
                <span className="inline-block mt-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
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
