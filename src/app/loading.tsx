export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      {/* Header Skeleton */}
      <div className="bg-[#0f172a] p-4 rounded-b-3xl h-36 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="w-24 h-6 bg-white/20 rounded-md"></div>
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
        <div className="w-full h-12 bg-white/10 rounded-2xl"></div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex gap-3 px-4 py-4 overflow-hidden">
        <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-28 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Hero Skeleton */}
      <div className="mx-5 mt-2 h-[280px] bg-gray-200 rounded-[2.5rem] animate-pulse"></div>

      {/* Product List Skeleton */}
      <div className="mt-8 px-6">
        <div className="w-40 h-6 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-[0_0_72%] sm:flex-[0_0_42%] bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100">
              <div className="h-56 w-full bg-gray-100 rounded-2xl mb-4 animate-pulse"></div>
              <div className="w-20 h-3 bg-gray-100 rounded mb-2 animate-pulse"></div>
              <div className="w-full h-5 bg-gray-100 rounded mb-4 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="w-16 h-6 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-100 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
