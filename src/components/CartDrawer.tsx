'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { X, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cart, removeFromCart, cartTotal } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onClose() // Close drawer
    router.push('/checkout') // Go to checkout page
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[100] max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="p-5 flex justify-between items-center border-b">
              <h2 className="text-xl font-extrabold text-gray-900">Your Cart</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
                      <img src={item.image_url} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800">{item.name}</p>
                        <p className="text-blue-600 font-bold">₦{item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t bg-white pb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-500">Total</span>
                <span className="font-extrabold text-2xl text-gray-900">₦{cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
