import React from "react";

interface FilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export default function FilterBar({ children, onReset }: FilterBarProps) {
  return (
    <div className="mb-6">
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {children}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
