'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminProductModal({ isOpen, onClose, productToEdit, categories, onSaveSuccess }: any) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // This ensures the form resets properly every time you open it
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name || '')
        setPrice(productToEdit.price?.toString() || '')
        setDiscountPrice(productToEdit.discount_price?.toString() || '')
        setCategoryId(productToEdit.category_id || '')
        setPreviewImage(productToEdit.image_url || '')
      } else {
        setName(''); setPrice(''); setDiscountPrice(''); 
        setCategoryId(categories[0]?.id || ''); 
        setPreviewImage(''); setImageFile(null);
      }
      setError('')
      setIsSaving(false)
    }
  }, [productToEdit, isOpen, categories])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewImage(URL.createObjectURL(file)) // Shows the new image instantly
    }
  }

  const handleSave = async () => {
    if (!name || !price || !categoryId) return setError('Please fill in Name, Price, and Category.')
    if (!productToEdit && !imageFile && !previewImage) return setError('Please select an image.')

    setIsSaving(true)
    setError('')

    try {
      let finalImageUrl = previewImage

      // 1. Upload new image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        // Create a unique filename so images never overwrite each other
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
        finalImageUrl = publicUrl
      }

      // 2. Prepare data for the specific product
      const productData = {
        name,
        price: parseFloat(price),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        category_id: categoryId,
        image_url: finalImageUrl
      }

      // 3. Insert new or Update existing product
      if (productToEdit) {
        const { error } = await supabase.from('products').update(productData).eq('id', productToEdit.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(productData)
        if (error) throw error
      }

      onSaveSuccess() // Refresh the list in the admin dashboard
      onClose() // Close the modal
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[100] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-5 flex justify-between items-center border-b">
              <h2 className="text-xl font-black text-gray-900">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 pb-32">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-bold text-center">{error}</div>}

              {/* Image Upload with Live Preview */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-48 bg-gray-50">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {previewImage ? (
                    <img src={previewImage} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-medium text-gray-500">Tap to select an image</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. Panadol Extra" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Original Price (₦)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="1000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Discount (₦) (Opt)</label>
                  <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="800" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t pb-8">
              <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 hover:bg-blue-700">
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Product</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
