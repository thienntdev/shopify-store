/** @format */

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-2xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full px-5 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-orange-50 rounded-lg transition-all duration-200 cursor-pointer group">
          <svg
            className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
