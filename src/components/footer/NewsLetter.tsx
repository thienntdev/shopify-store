/** @format */

export default function NewsLetter() {
  return (
    <div className="bg-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4">
          <div>
            <h3 className="text-4xl font-bold text-orange-600 mb-2">
              SIGN UP & GRAB 10% OFF
            </h3>
            <p className="text-gray-700 text-xl text-center font-medium">
              Join us for special offers and new arrivals
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-2xl">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 min-w-0 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-300 transition-all duration-200 text-gray-900 text-xl placeholder:text-gray-400"
            />
            <button className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all duration-200 font-bold uppercase whitespace-nowrap shadow-md cursor-pointer">
              Reveal Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
