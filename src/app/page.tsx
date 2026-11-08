import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

async function Storefront({ searchParams }: { searchParams: { category?: string } }) {
  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('*');
  
  // Fetch products (filtered by category if one is selected)
  let query = supabase.from('products').select('*, categories(name)');
  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category);
  }
  const { data: products, error } = await query;

  if (error) {
    return <div className="text-center p-10 text-red-600 font-bold">Error: {error.message}</div>;
  }

  return (
    <>
      {/* Sticky Header */}
      <div className="bg-[#131921] text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight text-white">DASWAM</h1>
          <div className="flex gap-4">
            <User size={24} />
            <ShoppingCart size={24} />
          </div>
        </div>
        
        <div className="flex items-center bg-white rounded-md overflow-hidden shadow-inner">
          <input type="text" placeholder="Search medicines..." className="flex-1 p-2 text-black outline-none text-sm" />
          <button className="bg-[#febd69] p-2 text-black">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-3 text-xs text-gray-300">
          <MapPin size={14} />
          <span>Deliver to Nigeria</span>
        </div>
      </div>

      <CategoryBar categories={categories || []} />

      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 mx-4 mt-4 rounded-2xl text-white shadow-xl">
        <h2 className="text-2xl font-extrabold mb-1">Pharmacy Essentials</h2>
        <p className="text-sm opacity-90">Genuine medications delivered to your door.</p>
      </div>

      <div className="mt-6">
        {products && products.length > 0 ? (
          <ProductCarousel title={searchParams.category ? 'Filtered Results' : 'All Medications'} products={products} />
        ) : (
          <div className="text-center p-10 text-gray-500">No products found in this category.</div>
        )}
      </div>
    </>
  );
}

export default function Home({ searchParams }: { searchParams: { category?: string } }) {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Suspense fallback={<div className="p-10 text-center">Loading Store...</div>}>
        <Storefront searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
