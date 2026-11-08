'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroCarousel() {
  // Slower transition (delay: 7000ms) and smooth glide
  const autoplay = useRef(Autoplay({ delay: 7000, stopOnInteraction: false }))
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 80 }, [autoplay.current])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
      subtitle: '100% Genuine Medications',
      title: 'Your Health,\nDelivered.',
      desc: 'Fast, secure, and reliable to your doorstep.'
    },
    {
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
      subtitle: 'Fresh & Daily',
      title: 'Provisions for\nYour Family.',
      desc: 'Everything you need, exactly when you need it.'
    },
    {
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop',
      subtitle: 'Glow & Care',
      title: 'Premium\nCosmetics.',
      desc: 'Because you deserve to feel your absolute best.'
    }
  ]

  return (
    <div className="relative mx-5 mt-6 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[280px]">
              {/* Slow zooming background image */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${selectedIndex === index ? 'scale-110' : 'scale-100'}`} 
                />
              </div>
              {/* Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Text Content with Framer Motion */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, staggerChildren: 0.1 }}
                    >
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-[11px] font-black uppercase tracking-widest text-blue-300 mb-2"
                      >
                        {slide.subtitle}
                      </motion.h2>
                      <motion.h1 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-4xl font-black text-white mb-2 leading-tight tracking-tight whitespace-pre-line"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-sm font-medium text-white/80 max-w-[250px]"
                      >
                        {slide.desc}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-interaction: Dot Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${selectedIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
