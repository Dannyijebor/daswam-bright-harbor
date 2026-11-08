'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

export default function HeroCarousel() {
  // Slow transition (delay: 5000ms) for that premium "breath" feel
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }))
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 40 }, [autoplay.current])

  const slides = [
    {
      title: "Christmas Sale",
      subtitle: "Up to 40% OFF. Ends Jan 15th.",
      desc: "Pharmaceuticals, Cosmetics & Provisions.",
      gradient: "from-[#1e1b4b] via-[#312e81] to-[#4338ca]", // Deep luxury indigo
      accent: "text-yellow-400"
    },
    {
      title: "Your Health, Delivered.",
      subtitle: "100% Genuine Medications",
      desc: "Fast, secure, and reliable to your doorstep.",
      gradient: "from-[#0f172a] via-[#0369a1] to-[#0284c7]", // Clean medical blue
      accent: "text-blue-200"
    },
    {
      title: "Daily Essentials",
      subtitle: "Everything you need",
      desc: "Provisions and cosmetics at unbeatable prices.",
      gradient: "from-[#064e3b] via-[#047857] to-[#059669]", // Fresh emerald
      accent: "text-emerald-200"
    }
  ]

  return (
    <div className="overflow-hidden mx-5 mt-6 rounded-[2.5rem] shadow-2xl shadow-blue-900/20" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <div className={`bg-gradient-to-br ${slide.gradient} p-8 h-[240px] flex flex-col justify-center relative overflow-hidden`}>
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <h2 className={`text-sm font-black uppercase tracking-widest ${slide.accent} mb-1`}>
                {slide.subtitle}
              </h2>
              <h1 className="text-4xl font-black text-white mb-2 leading-tight tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm font-medium text-white/80 max-w-[200px]">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
