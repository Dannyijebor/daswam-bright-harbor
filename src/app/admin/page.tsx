'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { PlusCircle, LogOut, Loader2, Pencil, Trash2, Tag, Layers, Image as ImageIcon, Package } from 'lucide-react'
import AdminProductModal from '@/components/AdminProductModal'
import AdminBannerModal from '@/components/AdminBannerModal'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'banners'>('inventory')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  
  // New Category State
  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState('pharmaceutical')
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchData()
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      // Fetch Products
      const { data: prods, error: pError } = await supabase.from('products').select('*, categories(name)').order('name')
      if (pError) throw pError
      setProducts(prods || [])

      // Fetch Categories
      const { data: cats, error: cError } = await supabase.from('categories').select('*').order('name')
      if (cError) throw cError
      setCategories(cats || [])

      // Fetch Banners
      const { data: bns, error: bError } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
      if (bError) throw bError
      setBanners(bns || [])

    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to load data. Check your database permissions.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  const handleAddCategory = async () => {
    if (!newCatName) return
    await supabase.from('categories').insert({ name: newCatName, type: newCatType })
    setNewCatName('')
    fetchData()
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category? Products in this category will be uncategorized.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    fetchData()
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] pb-24">
      {/* Header */}
      <div className="bg-[#0f172a] text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-black">Admin Center</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b overflow-x-auto hide-scrollbar sticky top-[68px] z-40">
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 ${activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
          <Package size={18} /> Inventory ({products.length})
        </button>
        <button onClick={() => setActiveTab('categories')} className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 ${activeTab === 'categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
          <Layers size={18} /> Categories
        </button>
        <button onClick={() => setActiveTab('banners')} className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 ${activeTab === 'banners' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
          <ImageIcon size={18} /> Adverts
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 mt-2">
        {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded-xl font-bold mb-4">{errorMsg}</div>}
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <>
            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center gap-2">
                  <PlusCircle size={20} /> Add New Product
                </button>
                <div className="bg-white rounded-3xl shadow-sm border overflow-hidden divide-y">
                  {products.map(product => (
                    <div key={product.id} className="p-4 flex items-center gap-4">
                      <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover border" />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{product.name}</p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">{product.categories?.name || 'Uncategorized'}</p>
                        <p className="text-sm font-black mt-1">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                  <h3 className="font-bold mb-3">Add New Category</h3>
                  <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Baby Care" className="w-full p-3 bg-gray-50 border rounded-xl mb-3" />
                  <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl mb-3">
                    <option value="pharmaceutical">Pharmaceutical</option>
                    <option value="provision">Provision</option><option value="cosmetics">Cosmetics</option>
                  </select>
                  <button onClick={handleAddCategory} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl">Add Category</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden divide-y">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{cat.name}</p>
                        <span className="text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded-md">{cat.type}</span>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BANNERS TAB */}
            {activeTab === 'banners' && (
              <div className="space-y-4">
                <button onClick={() => setIsBannerModalOpen(true)} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center gap-2">
                  <PlusCircle size={20} /> Add New Advert Banner
                </button>
                <div className="grid gap-4 md:grid-cols-2">
                  {banners.map(banner => (
                    <div key={banner.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden relative group">
                      <img src={banner.image_url} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p className="font-black text-lg">{banner.title}</p>
                        <p className="text-gray-500 text-sm">{banner.subtitle}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md uppercase">{banner.type}</span>
                          {banner.is_sale && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md">SALE</span>}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteBanner(banner.id)} className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-lg shadow-sm hover:bg-white"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AdminProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={editingProduct} categories={categories} onSaveSuccess={fetchData} />
      <AdminBannerModal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} onSaveSuccess={fetchData} />
    </main>
  )
}
