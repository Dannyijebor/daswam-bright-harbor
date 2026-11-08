'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function LifestyleCarousel() {
  // Very slow autoplay for a calm, premium feel
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }))
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 80 }, [autoplay.current])

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
      title: 'Care for your loved ones.',
      subtitle: 'Wellness starts at home.'
    },
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
      title: 'Freshness you can trust.',
      subtitle: 'Daily provisions for happy families.'
    },
    {
      url: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=800&auto=format&fit=crop',
      title: 'A healthier, brighter you.',
      subtitle: 'Premium vitamins and supplements.'
    }
  ]

  return (
    <div className="my-10 relative">
      <div className="overflow-hidden px-5" ref={emblaRef}>
        <div className="flex gap-4">
          {images.map((img, index) => (
            <div key={index} className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_35%] min-w-0">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative h-48 rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer"
              >
                {/* Image */}
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">{img.subtitle}</p>
                  <h3 className="text-white font-extrabold text-lg leading-tight">{img.title}</h3>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
