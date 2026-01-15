/** @format */

export default function BreadCrumbs({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <a href="/" className="hover:text-orange-500">
        Home
      </a>
      <span className="mx-2">/</span>
      <a href="/collections" className="hover:text-orange-500">
        Collections
      </a>
      <span className="mx-2">/</span>
      <span className="text-gray-900 capitalize">{children}</span>
    </nav>
  );
}
