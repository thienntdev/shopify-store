/** @format */
import Link from "next/link";

export default function CollectionButton({
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      {...props}
      className="inline-block  bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
    >
      {children}
    </Link>
  );
}
