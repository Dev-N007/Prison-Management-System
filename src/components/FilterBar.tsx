// src/components/FilterBar.tsx
import React from "react";

interface FilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
  className?: string;
}

/**
 * FilterBar
 * - children: the filter inputs (text, selects, date inputs)
 * - onReset: callback to reset filter state (pages should provide setFilters(() => initial))
 */
export const FilterBar: React.FC<FilterBarProps> = ({ children, onReset, className }) => {
  return (
    <div className={`mb-4 ${className || ""}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">{children}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onReset && onReset()}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
