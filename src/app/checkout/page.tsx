'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { placeOrder } from '../actions/checkout'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Check if any item requires a prescription
  const requiresPrescription = cart.some(item => item.is_prescription_required)
  const deliveryFee = cartTotal > 50 ? 0 : 5.00 // Free delivery over $50
  const finalTotal = cartTotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await placeOrder(formData, cart, finalTotal)
      if (result.success) {
        setIsSuccess(true)
        clearCart() // Empty the cart
      } else {
        setError(result.error || 'Something went wrong.')
      }
    } catch (err) {
      setError('A network error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. Empty Cart State
  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fafbfc]">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Truck className="text-blue-500" size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center">Looks like you haven't added anything yet.</p>
        <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg">Start Shopping</Link>
      </div>
    )
  }

  // 2. Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fafbfc]">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
          className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20"
        >
          <CheckCircle2 className="text-green-500" size={60} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl font-black text-gray-900 mb-2 text-center"
        >
          Order Confirmed!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8 text-center max-w-[300px]"
        >
          Your order is being prepared. Our pharmacist will call you shortly to confirm the delivery details.
        </motion.p>
        <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg">Back to Home</Link>
      </div>
    )
  }

  // 3. Checkout Form
  return (
    <main className="min-h-screen bg-[#fafbfc] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Prescription Warning */}
        {requiresPrescription && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-orange-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-orange-800 text-sm">Prescription Required</h3>
              <p className="text-orange-700 text-xs mt-1">One or more items in your cart require a valid prescription. Our pharmacist will contact you to verify before delivery.</p>
            </div>
          </motion.div>
        )}

        {/* Delivery Details Form */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Truck size={18} className="text-blue-600" /> Delivery Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input required name="name" type="text" placeholder="John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input required name="phone" type="tel" placeholder="+234 800 000 0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
              <textarea required name="address" rows={3} placeholder="Apartment, street name, city, state..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" /> Payment Method
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Banknote className="text-gray-500" />
                <span className="font-bold text-sm text-gray-800">Pay on Delivery</span>
              </div>
              <input type="radio" name="payment" value="Pay on Delivery" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            </label>
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
              <div className="flex items-center gap-3">
                <CreditCard className="text-gray-500" />
                <span className="font-bold text-sm text-gray-800">Card Payment (Coming Soon)</span>
              </div>
              <input type="radio" name="payment" value="Card" disabled className="w-4 h-4" />
            </label>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{error}</div>}
      </form>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-sm mb-2 text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium text-gray-800">₦{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-gray-500">
            <span>Delivery Fee</span>
            <span className="font-medium text-gray-800">{deliveryFee === 0 ? 'FREE' : `$₦{deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between items-center mb-4 border-t pt-3">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-2xl text-blue-600">₦{finalTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => {
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Processing...</>
            ) : (
              <><Lock size={18} /> Place Order Securely</>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}
