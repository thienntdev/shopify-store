/** @format */

interface FilterSectionHeaderProps {
  title: string;
  className?: string;
}

export default function FilterSectionHeader({
  title,
  className = "",
}: FilterSectionHeaderProps) {
  return (
    <h3 className={`text-sm font-semibold text-gray-900 mb-3 ${className}`}>
      {title}
    </h3>
  );
}
