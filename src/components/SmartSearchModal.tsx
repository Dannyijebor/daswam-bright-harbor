'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles, AlertCircle, MessageCircle, Stethoscope } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function SmartSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()
  const { addToCart } = useCart()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      })
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setResults(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0f172a] rounded-t-[2.5rem] z-[100] h-[85vh] flex flex-col shadow-2xl overflow-hidden border-t border-gray-700"
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-gray-800 bg-[#0f172a] z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-400" size={20} />
                <h2 className="text-lg font-black text-white tracking-tight">DASWAM AI Assistant</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 pb-32">
              {!results && !isLoading && (
                <div className="text-center mt-10">
                  <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope size={40} className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">How can we help you today?</h3>
                  <p className="text-gray-400 text-sm max-w-[250px] mx-auto">Describe your symptoms (e.g., "I have a bad headache" or "My stomach is upset") or search for a product.</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    {['Headache', 'Fever & Chills', 'Stomach Pain', 'Cough'].map(sym => (
                      <button key={sym} onClick={() => { setQuery(sym); setTimeout(() => document.getElementById('smart-submit')?.click(), 100) }} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center mt-20">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></motion.div>
                  <p className="text-blue-400 font-medium animate-pulse">Analyzing symptoms & inventory...</p>
                </div>
              )}

              {results && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Medical Advice Box */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-blue-400 font-bold text-sm mb-1">Pharmacist's Advice</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{results.advice}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Products */}
                  {results.products.length > 0 ? (
                    <div>
                      <h4 className="text-white font-bold mb-3">Recommended for you</h4>
                      <div className="space-y-3">
                        {results.products.map((product: any) => (
                          <div key={product.id} className="bg-gray-800/50 p-3 rounded-2xl flex items-center gap-4 border border-gray-700/50">
                            <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover bg-white" />
                            <div className="flex-1">
                              <p className="text-white font-bold text-sm line-clamp-1">{product.name}</p>
                              <p className="text-blue-400 font-black">${product.price.toFixed(2)}</p>
                            </div>
                            <button onClick={() => addToCart(product)} className="bg-blue-600 text-white p-2 rounded-xl text-xs font-bold px-3">Add</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400 text-sm">No exact matches in stock.</p>
                    </div>
                  )}

                  {/* Talk to Expert CTA */}
                  <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl p-4 text-center mt-6">
                    <MessageCircle className="text-emerald-400 mx-auto mb-2" size={24} />
                    <h4 className="text-white font-bold mb-1">Need a better alternative?</h4>
                    <p className="text-emerald-200/70 text-xs mb-3">Chat with a certified DASWAM pharmacist for personalized guidance.</p>
                    <button className="bg-emerald-500 text-white font-bold text-sm px-6 py-2 rounded-full shadow-lg w-full">Talk to an Expert Now</button>
                  </div>

                  <button onClick={handleReset} className="text-gray-400 text-sm text-center w-full mt-4 hover:text-white transition-colors">Start a new search</button>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0f172a] border-t border-gray-800 pb-8">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner border border-gray-700">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe symptoms or type a product..."
                  className="flex-1 p-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
                <button id="smart-submit" type="submit" disabled={isLoading} className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                  <Search size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
