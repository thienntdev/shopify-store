/** @format */

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center">
        <div className="w-10 h-10 relative">
          <div className="absolute inset-0 border-2 border-orange-500 rounded-tl-lg rounded-tr-lg"></div>
          <div className="absolute top-1 left-1 w-6 h-6 border-2 border-orange-500 rounded-full"></div>
          <div className="absolute top-1 right-1 w-6 h-6 border-2 border-blue-500 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-teal-700">Paw</span>
        <span className="text-xl font-bold text-teal-700">Zeno's</span>
      </div>
    </Link>
  );
}
