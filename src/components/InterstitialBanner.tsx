'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function InterstitialBanner({ title, desc, image, link, align = 'left' }: { title: string, desc: string, image: string, link: string, align?: 'left' | 'right' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-5 my-12 relative h-[220px] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center"
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className={`absolute inset-0 w-full h-full object-cover ${align === 'right' ? 'object-right' : 'object-left'}`} 
      />
      {/* Gradient Overlay for Text Readability */}
      <div className={`absolute inset-0 bg-gradient-to-r ${align === 'right' ? 'from-transparent to-black/80' : 'from-black/80 to-transparent'}`}></div>
      
      {/* Text Content */}
      <div className={`relative z-10 p-8 w-full max-w-[240px] ${align === 'right' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
        <h2 className="text-2xl font-black text-white leading-tight mb-2">{title}</h2>
        <p className="text-xs font-medium text-gray-300 mb-4">{desc}</p>
        <Link href={link} className={`inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-colors ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          Explore <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  )
}
