import { Suspense } from 'react';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';
import StaticBanner from '@/components/StaticBanner';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Loading from './loading';
import Link from 'next/link';

// Array of unique banners to cycle through
const BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1200&auto=format&fit=crop',
    title: 'The Christmas Mega Sale',
    subtitle: 'Get up to 40% off pharmaceuticals, cosmetics, and provisions. Ends Jan 15th!',
    isSale: true
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
    title: 'Care for the Whole Family',
    subtitle: 'Genuine medications and expert advice you can always trust.',
    isSale: false
  },
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    title: 'Freshness Delivered Daily',
    subtitle: 'Stock up on healthy provisions and daily essentials at unbeatable prices.',
    isSale: false
  },
  {
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1200&auto=format&fit=crop',
    title: 'Give the Gift of Wellness',
    subtitle: 'Premium cosmetics and supplements at 40% off for the holidays.',
    isSale: true
  }
];

async function Storefront({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const searchParams = await searchParamsPromise;
  const categoryId = searchParams?.category;

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  
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

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Header />
      <CategoryBar categories={categories || []} />
      
      {!categoryId && <HeroCarousel />}

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
            // This picks a different banner for each row, cycling through the 4 unique banners
            const banner = BANNERS[index % BANNERS.length];

            return (
              <div key={categoryName}>
                {/* 1. Product Row */}
                <ProductCarousel title={categoryName} products={catProducts} />
                
                {/* 2. Unique Static Banner after every row */}
                <StaticBanner 
                  image={banner.image}
                  title={banner.title}
                  subtitle={banner.subtitle}
                  isSale={banner.isSale}
                />
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
