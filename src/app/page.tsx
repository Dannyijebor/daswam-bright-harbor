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
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Header />
      <CategoryBar categories={categories || []} />

      {!categoryId && (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8 mx-5 mt-6 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
          <h2 className="text-4xl font-black mb-3 relative z-10 leading-tight tracking-tight">Your Health,<br/>Delivered.</h2>
          <p className="text-sm font-medium text-blue-100 relative z-10 max-w-[200px]">Genuine medications and daily essentials at your fingertips.</p>
        </div>
      )}

      {categoryId && products && products.length > 0 && (
        <div className="mt-6">
          <ProductCarousel title="Filtered Results" products={products} />
        </div>
      )}

      {!categoryId && groupedProducts && Object.keys(groupedProducts).length > 0 && (
        <div className="mt-2">
          {Object.entries(groupedProducts).map(([categoryName, catProducts]: [string, any]) => (
            <ProductCarousel key={categoryName} title={categoryName} products={catProducts} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-500">Loading Store...</div>}>
      <Storefront searchParamsPromise={searchParams} />
    </Suspense>
  );
}
