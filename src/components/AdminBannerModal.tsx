'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminBannerModal({ isOpen, onClose, onSaveSuccess }: any) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isSale, setIsSale] = useState(false)
  const [type, setType] = useState('interstitial')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setTitle(''); setSubtitle(''); setIsSale(false); setType('interstitial'); setPreviewImage(''); setImageFile(null);
    }
  }, [isOpen])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!imageFile) return setError('Please select an image.')
    setIsSaving(true); setError('')

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `banner-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)

      const { error: dbError } = await supabase.from('banners').insert({
        title, subtitle, image_url: publicUrl, is_sale: isSale, type
      })
      if (dbError) throw dbError

      onSaveSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error saving banner.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[100] max-h-[90vh] flex flex-col">
            <div className="p-5 flex justify-between items-center border-b">
              <h2 className="text-xl font-black text-gray-900">Add New Advert Banner</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 pb-32">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-bold text-center">{error}</div>}

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Banner Image (Wide format best)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-40 bg-gray-50">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <><ImageIcon className="text-gray-400 mb-2" size={32} /><p className="text-sm font-medium text-gray-500">Tap to upload</p></>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Main Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="e.g. Christmas Mega Sale" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Subtitle / Description</label>
                <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="e.g. Up to 40% off everything!" />
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <input type="checkbox" checked={isSale} onChange={e => setIsSale(e.target.checked)} className="w-5 h-5 accent-red-500" />
                <label className="font-bold text-sm text-gray-800">Show Christmas Sale Badge</label>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Banner Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="interstitial">Interstitial (Between product rows)</option>
                  <option value="hero">Hero (Main top slider)</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t pb-8">
              <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Banner</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
