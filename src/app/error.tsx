'use client'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-center">
      {/* Micro-interaction: Floating Wi-Fi icon */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm"
      >
        <WifiOff size={40} />
      </motion.div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">Connection Lost</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-[250px]">
        We can't reach the pharmacy right now. Please check your internet connection.
      </p>
      
      {/* Micro-interaction: Button press and spin icon on hover */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => reset()}
        className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30"
      >
        <RefreshCw size={18} />
        Try Again
      </motion.button>
    </main>
  )
}
