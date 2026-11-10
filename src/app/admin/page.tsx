'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { PlusCircle, LogOut, Loader2, Pencil, Trash2, Layers, Image as ImageIcon, Package, Search, ChevronDown, ChevronRight } from 'lucide-react'
import AdminProductModal from '@/components/AdminProductModal'
import AdminBannerModal from '@/components/AdminBannerModal'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'banners'>('inventory')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Search & Grouping State
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  
  // New Category State
  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState('pharmaceutical')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  
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
      const { data: prods, error: pError } = await supabase.from('products').select('*, categories(name)').order('name')
      if (pError) throw pError
      setProducts(prods || [])

      const { data: cats, error: cError } = await supabase.from('categories').select('*').order('name')
      if (cError) throw cError
      setCategories(cats || [])

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
    if (!newCatName.trim()) return alert('Please enter a category name')
    setIsAddingCategory(true)
    const { error } = await supabase.from('categories').insert({ name: newCatName.trim(), type: newCatType })
    setIsAddingCategory(false)
    if (error) {
      alert("Database Error: " + error.message)
    } else {
      alert(`Success! "${newCatName}" has been added.`)
      setNewCatName('')
      fetchData()
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category? Products in this category will become uncategorized.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    fetchData()
  }

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }))
  }

  // --- FILTERING AND GROUPING LOGIC ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categories?.name || 'Uncategorized').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedInventory = filteredProducts.reduce((acc: Record<string, any[]>, product) => {
    const catName = product.categories?.name || 'Uncategorized'
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(product)
    return acc
  }, {})

  const sortedCategoryNames = Object.keys(groupedInventory).sort()

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
                
                {/* Controls: Add Button & Search Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors">
                    <PlusCircle size={20} /> Add New Product
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name or category..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                {/* Search Results / Categorized List */}
                {sortedCategoryNames.length === 0 ? (
                  <div className="text-center p-10 text-gray-500 bg-white rounded-2xl shadow-sm">No products found matching your search.</div>
                ) : (
                  <div className="space-y-4">
                    {sortedCategoryNames.map(catName => {
                      const catProducts = groupedInventory[catName];
                      const isExpanded = expandedCategories[catName] !== false; // Default to expanded

                      return (
                        <div key={catName} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          {/* Category Header - Clickable to Expand/Collapse */}
                          <button 
                            onClick={() => toggleCategory(catName)}
                            className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
                              <h3 className="font-black text-gray-900 text-lg">{catName}</h3>
                              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {catProducts.length}
                              </span>
                            </div>
                          </button>

                          {/* Category Products */}
                          {isExpanded && (
                            <div className="divide-y divide-gray-50">
                              {catProducts.map(product => (
                                <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                  <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover border bg-white" />
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{product.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-sm font-black text-gray-800">₦{product.price.toFixed(2)}</p>
                                      {product.discount_price && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                          Sale: ₦{product.discount_price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Pencil size={18} /></button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                  <h3 className="font-bold mb-3">Add New Category</h3>
                  <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Anti Malaria" className="w-full p-3 bg-gray-50 border rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pharmaceutical">Pharmaceutical</option>
                    <option value="provision">Provision</option>
                    <option value="cosmetics">Cosmetics</option>
                  </select>
                  <button onClick={handleAddCategory} disabled={isAddingCategory} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl flex justify-center items-center hover:bg-gray-800">
                    {isAddingCategory ? <Loader2 className="animate-spin" /> : 'Add Category'}
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden divide-y divide-gray-100">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{cat.name}</p>
                        <span className="text-[10px] uppercase font-bold bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">{cat.type}</span>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BANNERS TAB */}
            {activeTab === 'banners' && (
              <div className="space-y-4">
                <button onClick={() => setIsBannerModalOpen(true)} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center gap-2 hover:bg-emerald-700">
                  <PlusCircle size={20} /> Add New Advert Banner
                </button>
                <div className="grid gap-4 md:grid-cols-2">
                  {banners.map(banner => (
                    <div key={banner.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden relative group">
                      <img src={banner.image_url} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p className="font-black text-lg text-gray-900">{banner.title}</p>
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
