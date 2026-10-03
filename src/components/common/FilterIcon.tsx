import React from 'react';

interface FilterIconProps {
  className?: string;
  strokeWidth?: number | string;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  className = 'w-4 h-4',
  strokeWidth = 2,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  );
};
