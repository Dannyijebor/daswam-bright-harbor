'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryBar({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const handleSelect = (id: string | null) => {
    if (id) {
      router.push(`/?category=${id}`, { scroll: false })
    } else {
      router.push(`/`, { scroll: false })
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto py-4 px-4 bg-white shadow-sm sticky top-[140px] z-40 hide-scrollbar">
      <button
        onClick={() => handleSelect(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          !activeCategory ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
