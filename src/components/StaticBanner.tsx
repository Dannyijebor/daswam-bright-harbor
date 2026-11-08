'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function StaticBanner({ image, title, subtitle, isSale }: { image: string, title: string, subtitle: string, isSale?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-5 my-10 relative h-60 rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-7 flex flex-col justify-end items-start">
        {isSale && (
          <motion.span 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 shadow-lg flex items-center gap-1"
          >
            🎄 Christmas Sale • Up to 40% Off
          </motion.span>
        )}
        <h3 className="text-2xl font-black text-white leading-tight mb-1">{title}</h3>
        <p className="text-sm text-gray-300 font-medium mb-4 max-w-[80%]">{subtitle}</p>
        
        <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full group-hover:bg-white/30 transition-colors">
          Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}
