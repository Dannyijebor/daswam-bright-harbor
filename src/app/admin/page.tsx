'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { PlusCircle, LogOut, Loader2, Pencil, Trash2, Tag } from 'lucide-react'
import AdminProductModal from '@/components/AdminProductModal'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const router = useRouter()

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
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    if (cats) setCategories(cats)
    
    const { data: prods } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
    if (prods) setProducts(prods)
    
    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: any) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] pb-24">
      {/* Header */}
      <div className="bg-[#0f172a] text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-black">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        
        {/* Add Button */}
        <button 
          onClick={openAddModal}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} /> Add New Product
        </button>

        {/* Product List */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4 flex justify-between items-center">
            Current Inventory <span className="bg-blue-100 text-blue-700 text-xs py-1 px-3 rounded-full">{products.length} items</span>
          </h2>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No products yet. Tap "Add New Product" to start.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {products.map(product => (
                  <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover bg-gray-100 border" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{product.name}</p>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{product.categories?.name}</p>
                      
                      <div className="flex gap-2 items-center mt-1">
                        {product.discount_price ? (
                          <>
                            <span className="text-sm font-black text-green-600 flex items-center gap-1">
                              <Tag size={12}/> ${product.discount_price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-sm font-black text-gray-800">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(product)} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* The Modal */}
      <AdminProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={editingProduct} 
        categories={categories}
        onSaveSuccess={fetchData}
      />
    </main>
  )
}
