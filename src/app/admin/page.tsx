'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PlusCircle, LogOut, Loader2, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    checkUser()
    fetchData()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
  }

  const fetchData = async () => {
    setIsLoading(true)
    const { data: cats } = await supabase.from('categories').select('*')
    if (cats) {
      setCategories(cats)
      if (cats.length > 0) setCategoryId(cats[0].id)
    }
    
    const { data: prods } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
    if (prods) setProducts(prods)
    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile || !name || !price || !categoryId) return alert('Please fill all required fields')
    
    setIsUploading(true)

    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile)
      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)

      // 3. Save Product to Database
      const { error: dbError } = await supabase.from('products').insert({
        name,
        price: parseFloat(price),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        category_id: categoryId,
        image_url: publicUrl,
        is_prescription_required: false
      })
      if (dbError) throw dbError

      // Reset form & refresh
      setName(''); setPrice(''); setDiscountPrice(''); setImageFile(null);
      fetchData()
      alert('Product added successfully!')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] pb-24">
      {/* Header */}
      <div className="bg-[#0f172a] text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-black">DASWAM Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-8 mt-4">
        
        {/* ADD PRODUCT FORM */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <PlusCircle className="text-blue-600" /> Add New Product
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Product Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. Panadol Extra" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Category *</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Original Price ($) *</label>
                <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="10.00" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Discount Price ($) (Optional)</label>
                <input type="number" step="0.01" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="8.00 (Leave empty for no sale)" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Product Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative">
                <input required type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm font-medium text-gray-600">{imageFile ? imageFile.name : 'Tap to select image from gallery'}</p>
              </div>
            </div>

            <button disabled={isUploading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg flex justify-center hover:bg-blue-700 transition-colors">
              {isUploading ? <Loader2 className="animate-spin" /> : 'Save Product to Store'}
            </button>
          </form>
        </div>

        {/* PRODUCT LIST */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Current Inventory ({products.length})</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {products.map(product => (
                  <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.categories?.name}</p>
                      <div className="flex gap-2 items-center mt-1">
                        {product.discount_price ? (
                          <>
                            <span className="text-sm font-black text-green-600">${product.discount_price.toFixed(2)}</span>
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-sm font-black text-gray-800">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => alert('Edit feature coming next!')} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
