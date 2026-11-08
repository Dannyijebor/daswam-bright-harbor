import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';
import InterstitialBanner from '@/components/InterstitialBanner';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Loading from './loading';
import Link from 'next/link';

async function Storefront({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string, search?: string }> }) {
  const searchParams = await searchParamsPromise;
  const categoryId = searchParams?.category;
  const searchQuery = searchParams?.search;

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  
  let query = supabase.from('products').select('*, categories(name)');
  
  if (categoryId) query = query.eq('category_id', categoryId);
  if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);
  
  const { data: products, error } = await query;

  if (error) return <div className="text-center p-10 text-gray-500 font-medium">Please check your connection.</div>;

  const groupedProducts = products?.reduce((acc: any, product: any) => {
    const catName = product.categories?.name || 'Other Medications';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  // If searching, show a dedicated search results layout
  if (searchQuery) {
    return (
      <main className="min-h-screen bg-[#fafbfc] pb-24">
        <Header />
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-500 text-sm mb-6">Showing results for "{searchQuery}"</p>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => (
                 <div key={p.id} className="col-span-1"><ProductCarouselCard product={p} /></div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium mb-4">No products found for "{searchQuery}".</p>
              <Link href="/" className="text-blue-600 font-bold hover:underline">Clear Search</Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Header />
      <CategoryBar categories={categories || []} />
      {!categoryId && <HeroCarousel />}

      {/* "View All" Quick Link */}
      {!categoryId && (
        <div className="flex justify-end px-6 mt-6">
          <Link href="/shop" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
            View All Items →
          </Link>
        </div>
      )}

      {categoryId && products && products.length > 0 && (
        <div className="mt-6"><ProductCarousel title="Filtered Results" products={products} /></div>
      )}

      {!categoryId && groupedProducts && Object.keys(groupedProducts).length > 0 && (
        <div className="mt-2 flex flex-col">
          {Object.entries(groupedProducts).map(([categoryName, catProducts]: [string, any], index) => {
            // Interleave banners after the 1st and 3rd category rows
            return (
              <div key={categoryName}>
                <ProductCarousel title={categoryName} products={catProducts} />
                
                {index === 0 && (
                  <InterstitialBanner 
                    title="Refresh Your Day" 
                    desc="Premium cosmetics and skincare essentials to keep you glowing."
                    image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                    link="/shop"
                    align="left"
                  />
                )}
                {index === 2 && (
                  <InterstitialBanner 
                    title="Stock Up & Save" 
                    desc="Provisions and daily groceries you need, delivered fast."
                    image="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
                    link="/shop"
                    align="right"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

// Helper to render a card in the search grid without the full carousel logic
import ProductCard from '@/components/ProductCard';
function ProductCarouselCard({ product }: { product: any }) {
    return <ProductCard product={product} />
}

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string, search?: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <Storefront searchParamsPromise={searchParams} />
    </Suspense>
  );
}
