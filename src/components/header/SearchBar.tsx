/** @format */

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-2xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full px-4 py-2 pr-10 border border-gray-500 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder:text-orange-500"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity">
          <svg
            className="w-5 h-5 text-orange-500"
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
