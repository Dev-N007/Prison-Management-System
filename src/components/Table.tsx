import React from "react";
import { useRouter } from "next/router";

type SortOrder = "asc" | "desc";

interface TableProps {
  data: any[];
  columns: string[];
  baseUrl?: string;
  sortableColumns?: string[];
  sortBy?: string;
  sortOrder?: SortOrder;
  onSort?: (col: string) => void;
}

function renderCellValue(row: any, col: string) {
  const val = row[col];
  if (val === null || val === undefined) return "";

  if (typeof val === "object") {
    if ("name" in val) return val.name;
    if ("blockName" in val) return val.blockName;
    return JSON.stringify(val);
  }

  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return val.substring(0, 10);
  }

  return String(val);
}

export default function Table({
  data,
  columns,
  baseUrl,
  sortableColumns = [],
  sortBy,
  sortOrder = "asc",
  onSort,
}: TableProps) {
  const router = useRouter();

  const handleSort = (col: string) => {
    if (sortableColumns.includes(col) && onSort) onSort(col);
  };

  const renderSortIcon = (col: string) => {
    if (!sortableColumns.includes(col)) return null;
    if (sortBy !== col) return <span className="ml-1 text-gray-400">⇅</span>;

    return sortOrder === "asc" ? (
      <span className="ml-1 text-gray-600">▲</span>
    ) : (
      <span className="ml-1 text-gray-600">▼</span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 align-middle ${
                  sortableColumns.includes(col)
                    ? "cursor-pointer select-none"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  {col}
                  {renderSortIcon(col)}
                </div>
              </th>
            ))}

            {baseUrl && (
              <th className="w-40 px-4 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {(!data || data.length === 0) && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-4 text-center text-gray-500"
              >
                No records found
              </td>
            </tr>
          )}

          {data.map((row: any, i: number) => (
            <tr key={row.id ?? i} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-sm align-middle">
                  {renderCellValue(row, col)}
                </td>
              ))}

              {baseUrl && (
                <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">

                  {/* EDIT BUTTON -> /edit/[id] */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${baseUrl}/edit/${row.id}`);
                    }}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md text-sm transition"
                  >
                    Edit
                  </button>

                  {/* DELETE BUTTON -> /delete/[id] */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${baseUrl}/delete/${row.id}`);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
                  >
                    Delete
                  </button>

                </td>
              )}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
