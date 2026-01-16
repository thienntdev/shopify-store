/** @format */

"use client";

import CloseIcon from "./CloseIcon";
import IconButton from "./IconButton";

interface FilterChipProps {
  label: string;
  value: string;
  type: string;
  onRemove: (type: string, value: string) => void;
  showCloseButton?: boolean;
  className?: string;
}

export default function FilterChip({
  label,
  value,
  type,
  onRemove,
  showCloseButton = true,
  className = "",
}: FilterChipProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full ${className}`}
    >
      <button
        onClick={() => onRemove(type, value)}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer truncate max-w-[200px]"
        title={label}
      >
        {label}
      </button>
      {showCloseButton && (
        <IconButton
          icon={<CloseIcon size="sm" className="text-gray-500" />}
          label={`Remove ${label}`}
          onClick={() => onRemove(type, value)}
          variant="ghost"
          size="sm"
        />
      )}
    </div>
  );
}
