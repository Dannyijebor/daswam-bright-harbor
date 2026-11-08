import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';
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
      
      {/* Animated Sale Ticker */}
      <div className="bg-[#111827] text-white text-[11px] font-bold tracking-widest uppercase py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          🎄 Christmas Sale: Up to 40% OFF Pharmaceuticals, Cosmetics & Provisions! Ends Jan 15th 🎄
        </div>
      </div>

      <CategoryBar categories={categories || []} />

      {!categoryId && <HeroCarousel />}

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
