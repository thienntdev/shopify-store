// src/components/HappyCustomers.tsx
/** @format */

import Image from "next/image";

export interface HappyCustomerImage {
  src: string;
  alt: string;
}

interface HappyCustomersProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  topRowImages?: HappyCustomerImage[]; // 2 images
  bottomRowImages?: HappyCustomerImage[]; // 4 images
  backgroundColor?: string;
}

export default function HappyCustomers({
  title = "Happy Customers",
  subtitle = "Unwrap Happiness with Every Gift. Join the Paw Zeno Family of Delighted Shoppers!",
  buttonText = "Show More",
  buttonHref,
  topRowImages = [
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+1", alt: "Happy Customer 1" },
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+2", alt: "Happy Customer 2" },
  ],
  bottomRowImages = [
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+3", alt: "Happy Customer 3" },
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+4", alt: "Happy Customer 4" },
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+5", alt: "Happy Customer 5" },
    { src: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+6", alt: "Happy Customer 6" },
  ],
  backgroundColor = "bg-white",
}: HappyCustomersProps) {
  // Đảm bảo chỉ lấy 2 images cho top row
  const topImages = topRowImages.slice(0, 2);
  // Đảm bảo chỉ lấy 4 images cho bottom row
  const bottomImages = bottomRowImages.slice(0, 4);

  const ButtonComponent = buttonHref ? (
    <a
      href={buttonHref}
      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors w-fit"
    >
      {buttonText}
    </a>
  ) : (
    <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors w-fit">
      {buttonText}
    </button>
  );

  return (
    <section className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <ul className="list-none p-0 m-0 grid grid-cols-1 lg:grid-cols-8 gap-6 auto-rows-auto">
          {/* Text Content - spans 4 columns on large screens, row 1 */}
          <li className="lg:col-span-4 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
              {title}
            </h2>
            <p className="text-base md:text-lg text-gray-900 mb-6">
              {subtitle}
            </p>
            {ButtonComponent}
          </li>

          {/* Top Row Images - row 1, 2 images, each spans 2 columns */}
          {topImages.map((image, index) => (
            <li
              key={`top-${index}`}
              className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
            </li>
          ))}

          {/* Bottom Row: 4 Images - row 2, each spans 2 columns */}
          {bottomImages.map((image, index) => (
            <li
              key={`bottom-${index}`}
              className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}