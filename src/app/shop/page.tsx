import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import Loading from '../loading';

async function AllProducts() {
  const { data: products } = await supabase.from('products').select('*, categories(name)');

  return (
    <div className="max-w-7xl mx-auto p-4 pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center gap-4">
        <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-800" />
        </Link>
        <h1 className="text-xl font-black text-gray-900">All Products</h1>
      </div>
      <Suspense fallback={<Loading />}>
        <AllProducts />
      </Suspense>
    </main>
  )
}
