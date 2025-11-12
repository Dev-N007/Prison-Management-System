import React from "react";
import Link from "next/link";

type SortOrder = "asc" | "desc";

interface TableProps {
  data: any[];
  columns: string[];
  baseUrl?: string;
  sortableColumns?: string[];
  sortBy?: string | null;
  sortOrder?: SortOrder;
  onSort?: (col: string) => void;
  rowKey?: string;
}

function renderCellValue(row: any, col: string) {
  const val = row[col];
  if (val === null || val === undefined) return "";

  if (typeof val === "object") {
    if ("name" in val) return val.name;
    if ("blockName" in val) return val.blockName;
    return JSON.stringify(val);
  }

  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    return val.substring(0, 10);
  }

  return String(val);
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  baseUrl,
  sortableColumns = [],
  sortBy,
  sortOrder = "desc",
  onSort,
  rowKey = "id",
}) => {
  const handleSortClick = (col: string) => {
    if (!sortableColumns.includes(col)) return;
    if (onSort) onSort(col);
  };

  const renderSortIcon = (col: string) => {
    if (!sortableColumns.includes(col)) return null;

    if (sortBy !== col) {
      return <span className="ml-2 text-gray-400">⇅</span>;
    }

    return sortOrder === "asc" ? (
      <span className="ml-2 text-gray-600">▲</span>
    ) : (
      <span className="ml-2 text-gray-600">▼</span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSortClick(col)}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                  sortableColumns.includes(col)
                    ? "cursor-pointer select-none"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="capitalize">{col}</span>
                  {renderSortIcon(col)}
                </div>
              </th>
            ))}

            {baseUrl && <th className="px-4 py-3"></th>}
          </tr>
        </thead>

        <tbody>
          {(!data || data.length === 0) && (
            <tr>
              <td
                colSpan={columns.length + (baseUrl ? 1 : 0)}
                className="text-center p-4 text-gray-500"
              >
                No records found
              </td>
            </tr>
          )}

          {data &&
            data.map((row: any, index: number) => {
              const key = row[rowKey] ?? index;

              return (
                <tr key={key} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-sm">
                      {renderCellValue(row, col)}
                    </td>
                  ))}

                  {baseUrl && (
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`${baseUrl}/${row.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
