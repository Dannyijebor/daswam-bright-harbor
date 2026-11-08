import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

async function Storefront({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const searchParams = await searchParamsPromise;
  const categoryId = searchParams?.category;

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  
  let query = supabase.from('products').select('*, categories(name)');
  if (categoryId) query = query.eq('category_id', categoryId);
  
  const { data: products, error } = await query;

  if (error) return <div className="text-center p-10 text-red-600 font-bold">Error: {error.message}</div>;

  const groupedProducts = products?.reduce((acc: any, product: any) => {
    const catName = product.categories?.name || 'Other Medications';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <CategoryBar categories={categories || []} />

      {!categoryId && (
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 mx-4 mt-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h2 className="text-3xl font-black mb-2 relative z-10 leading-tight">Pharmacy <br/>Essentials</h2>
          <p className="text-sm font-medium text-blue-100 relative z-10">Genuine medications delivered to your door in minutes.</p>
        </div>
      )}

      {categoryId && products && products.length > 0 && (
        <div className="mt-6">
          <ProductCarousel title="Filtered Results" products={products} />
        </div>
      )}

      {!categoryId && groupedProducts && Object.keys(groupedProducts).length > 0 && (
        <div className="mt-4 pb-10">
          {Object.entries(groupedProducts).map(([categoryName, catProducts]: [string, any]) => (
            <ProductCarousel key={categoryName} title={categoryName} products={catProducts} />
          ))}
        </div>
      )}
    </>
  );
}

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <main className="min-h-screen bg-[#f5f7fa] pb-20">
      <Suspense fallback={<div className="p-10 text-center font-bold text-gray-500">Loading Store...</div>}>
        <Storefront searchParamsPromise={searchParams} />
      </Suspense>
    </main>
  );
}
