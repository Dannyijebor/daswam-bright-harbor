'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Save, Camera, ImagePlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

export default function AdminProductModal({ isOpen, onClose, productToEdit, categories, onSaveSuccess }: any) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name || '')
        setPrice(productToEdit.price?.toString() || '')
        setDiscountPrice(productToEdit.discount_price?.toString() || '')
        setCategoryId(productToEdit.category_id || '')
        setPreviewImage(productToEdit.image_url || '')
        setImageFile(null)
      } else {
        setName(''); setPrice(''); setDiscountPrice(''); 
        setCategoryId(categories[0]?.id || ''); 
        setPreviewImage(''); setImageFile(null);
      }
      setError('')
      setIsSaving(false)
      setIsCompressing(false)
    }
  }, [productToEdit, isOpen, categories])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsCompressing(true)
      setError('')
      try {
        // Compress the image so it uploads fast, even on mobile data
        const options = {
          maxSizeMB: 1, // Max size 1MB
          maxWidthOrHeight: 1024, // Max resolution 1024px
          useWebWorker: true,
        }
        
        const compressedFile = await imageCompression(file, options)
        
        // Convert back to a File object so Supabase accepts it
        const finalFile = new File([compressedFile], file.name || `camera-${Date.now()}.jpg`, { type: file.type || 'image/jpeg' })
        
        setImageFile(finalFile)
        setPreviewImage(URL.createObjectURL(finalFile))
      } catch (err) {
        console.error("Compression error:", err)
        // Fallback: if compression fails, just use the original file
        setImageFile(file)
        setPreviewImage(URL.createObjectURL(file))
      } finally {
        setIsCompressing(false)
      }
    }
  }

  const handleSave = async () => {
    if (!name || !price || !categoryId) return setError('Please fill in Name, Price, and Category.')
    if (!productToEdit && !imageFile && !previewImage) return setError('Please provide an image.')

    setIsSaving(true)
    setError('')

    try {
      let finalImageUrl = previewImage

      if (imageFile) {
        // Robust extension detection (handles camera files without standard names)
        let fileExt = 'jpg'
        if (imageFile.name && imageFile.name.includes('.')) {
          fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        } else if (imageFile.type) {
          fileExt = imageFile.type.split('/')[1] || 'jpg'
        }
        if (fileExt === 'jpeg') fileExt = 'jpg'
        
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile)
        
        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}. Ensure your bucket allows this file type.`)
        }

        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
        finalImageUrl = publicUrl
      }

      const productData = {
        name,
        price: parseFloat(price),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        category_id: categoryId,
        image_url: finalImageUrl
      }

      if (productToEdit) {
        const { error } = await supabase.from('products').update(productData).eq('id', productToEdit.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(productData)
        if (error) throw error
      }

      onSaveSuccess()
      onClose()
    } catch (err: any) {
      console.error("Save error details:", err)
      setError(err.message || 'Something went wrong while saving.')
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
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-bold text-center leading-tight">{error}</div>}

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Product Image</label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-48 bg-gray-50 mb-3">
                  {isCompressing ? (
                    <div className="flex flex-col items-center text-blue-600">
                       <Loader2 className="animate-spin mb-2" size={32} />
                       <p className="text-sm font-bold">Optimizing Image...</p>
                    </div>
                  ) : previewImage ? (
                    <img src={previewImage} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-medium text-gray-500">No image selected</p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleImageChange} 
                      disabled={isCompressing || isSaving}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                    />
                    <button className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 flex items-center justify-center gap-2 pointer-events-none">
                      <Camera size={18} /> Take Photo
                    </button>
                  </div>

                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      disabled={isCompressing || isSaving}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                    />
                    <button className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 pointer-events-none">
                      <ImagePlus size={18} /> Gallery
                    </button>
                  </div>
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
              <button onClick={handleSave} disabled={isSaving || isCompressing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Product</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
