/** @format */

import Image from "next/image";
import CollectionButton from "@/components/ui/nav/CollectionButton";
import { getCollectionByHandle } from "@/libs/shopify";

interface HeroBannerProps {
  buttonText: string;
  reverse?: boolean; // Nếu true: image bên trái, text bên phải. Nếu false: text bên trái, image bên phải
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  collectionHandle?: string;
}

export default async function HeroBanner({
  buttonText,
  reverse = false,
  collectionHandle,
  backgroundColor = "bg-linear-to-r from-orange-50 via-red-50 to-pink-50",
  titleColor = "text-red-600",
  subtitleColor = "text-gray-700",
}: HeroBannerProps) {
  let image = "";
  let imageAlt = "";
  let title = "";
  let subtitle = "";
  let buttonHref = "";

  if (collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle);
    image = collection?.image?.url || "";
    imageAlt = collection?.title || "";
    title = collection?.title || "";
    subtitle = collection?.description || "";
    buttonHref = `/collections/${collectionHandle}`;
  }

  return (
    <section className={`py-8 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className={`relative ${reverse ? "lg:order-1" : "lg:order-2"}`}>
            <div
              className={`relative w-4/5 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg ${reverse ? "mr-auto" : "ml-auto"}`}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover right-0"
                // sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={image.includes("cdn.shopify.com")}
              />
            </div>
          </div>

          {/* Text Content Section */}
          <div
            className={`text-center ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${titleColor}`}
            >
              {title}
            </h1>
            <p
              className={`text-xl md:text-xl mb-8 max-w-md mx-auto ${subtitleColor}`}
            >
              {subtitle}
            </p>
            <CollectionButton href={buttonHref}>{buttonText}</CollectionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
