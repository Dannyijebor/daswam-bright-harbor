import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';
import StaticBanner from '@/components/StaticBanner';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Loading from './loading';
import Link from 'next/link';

async function Storefront({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const searchParams = await searchParamsPromise;
  const categoryId = searchParams?.category;

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const { data: banners } = await supabase.from('banners').select('*');
  
  let query = supabase.from('products').select('*, categories(name)');
  if (categoryId) query = query.eq('category_id', categoryId);
  
  const { data: products, error } = await query;

  if (error) return <div className="text-center p-10 text-gray-500 font-medium">Please check your connection.</div>;

  const groupedProducts = products?.reduce((acc: any, product: any) => {
    const catName = product.categories?.name || 'Other Medications';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const sortedCategoryEntries = groupedProducts ? Object.entries(groupedProducts).sort(([a], [b]) => {
    if (a === 'Provisions') return -1;
    if (b === 'Provisions') return 1;
    return a.localeCompare(b);
  }) : [];

  const heroBanners = banners?.filter(b => b.type === 'hero') || [];
  const interstitialBanners = banners?.filter(b => b.type === 'interstitial') || [];

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Header />
      <CategoryBar categories={categories || []} />
      
      {!categoryId && <HeroCarousel banners={heroBanners} />}

      {!categoryId && (
        <div className="mx-5 mt-6 mb-2">
           <StaticBanner 
              image="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              title="Fresh Provisions Delivered"
              subtitle="Biscuits, milk, soap, drinks and all your daily groceries in one place."
              isSale={false}
           />
        </div>
      )}

      {!categoryId && (
        <div className="flex justify-end px-6 mt-2">
          <Link href="/shop" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
            View All Items →
          </Link>
        </div>
      )}

      {categoryId && products && products.length > 0 && (
        <div className="mt-6"><ProductCarousel title="Filtered Results" products={products} /></div>
      )}

      {!categoryId && sortedCategoryEntries.length > 0 && (
        <div className="mt-2 flex flex-col">
          {sortedCategoryEntries.map(([categoryName, catProducts]: [string, any], index) => {
            const randomBanner = interstitialBanners.length > 0 
              ? interstitialBanners[index % interstitialBanners.length] 
              : null;

            return (
              <div key={categoryName}>
                <ProductCarousel title={categoryName} products={catProducts} />
                
                {randomBanner && categoryName !== 'Provisions' && (
                  <StaticBanner 
                    image={randomBanner.image_url}
                    title={randomBanner.title}
                    subtitle={randomBanner.subtitle}
                    isSale={randomBanner.is_sale}
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

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <Storefront searchParamsPromise={searchParams} />
    </Suspense>
  );
}
