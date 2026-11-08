import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

async function Storefront({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const searchParams = await searchParamsPromise;
  const categoryId = searchParams?.category;

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  
  let query = supabase.from('products').select('*, categories(name)');
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  const { data: products, error } = await query;

  if (error) {
    return <div className="text-center p-10 text-red-600 font-bold">Error: {error.message}</div>;
  }

  // Group products by category name for the "All Products" view
  const groupedProducts = products?.reduce((acc: any, product: any) => {
    const catName = product.categories?.name || 'Other Medications';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  return (
    <>
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

      {!categoryId && (
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 mx-4 mt-4 rounded-2xl text-white shadow-xl">
          <h2 className="text-2xl font-extrabold mb-1">Pharmacy Essentials</h2>
          <p className="text-sm opacity-90">Genuine medications delivered to your door.</p>
        </div>
      )}

      {/* If a specific category is selected, show one big list */}
      {categoryId && products && products.length > 0 && (
        <div className="mt-6">
          <ProductCarousel title="Filtered Results" products={products} />
        </div>
      )}

      {/* If "All Products" is selected, show multiple segmented rows */}
      {!categoryId && groupedProducts && Object.keys(groupedProducts).length > 0 && (
        <div className="mt-4 pb-10">
          {Object.entries(groupedProducts).map(([categoryName, catProducts]: [string, any]) => (
            <ProductCarousel key={categoryName} title={categoryName} products={catProducts} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {(!products || products.length === 0) && (
        <div className="text-center p-10 text-gray-500">No products found in this category.</div>
      )}
    </>
  );
}

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Suspense fallback={<div className="p-10 text-center font-bold text-gray-500">Loading Store...</div>}>
        <Storefront searchParamsPromise={searchParams} />
      </Suspense>
    </main>
  );
}
