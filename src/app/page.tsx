import ProductCarousel from '@/components/ProductCarousel';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-[#131921] text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight">DASWAM</h1>
          <div className="flex gap-4">
            <User size={24} />
            <ShoppingCart size={24} />
          </div>
        </div>
        
        <div className="flex items-center bg-white rounded-md overflow-hidden">
          <input type="text" placeholder="Search medicines, groceries..." className="flex-1 p-2 text-black outline-none" />
          <button className="bg-[#febd69] p-2 text-black">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-3 text-sm text-gray-300">
          <MapPin size={16} />
          <span>Deliver to Nigeria</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 m-4 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Fast. Easy. Reliable.</h2>
        <p className="text-sm opacity-90">Get your pharmaceuticals and provisions delivered to your door.</p>
      </div>

      {products && products.length > 0 ? (
        <>
          <ProductCarousel title="Pharmacy Essentials" products={products} />
          <ProductCarousel title="Daily Provisions" products={products} />
        </>
      ) : (
        <div className="text-center p-10 text-gray-500">
          No products found. Check your database connection!
        </div>
      )}
    </main>
  );
}
