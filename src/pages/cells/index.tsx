import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";
import { useRouter } from "next/router";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Cells() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    blockName: "",
    capacity_min: "",
    capacity_max: "",
    free_min: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Server-sort fields
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Whether we are sorting on computed fields (free or occupied)
  const [clientSort, setClientSort] = useState<{
    enabled: boolean;
    field: "free" | "occupied" | null;
  }>({
    enabled: false,
    field: null,
  });

  // Auto-sort by free when coming from dashboard
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.autoSort === "free") {
      setClientSort({ enabled: true, field: "free" });
    }
  }, [router.isReady]);

  const onReset = () => {
    setFilters({
      blockName: "",
      capacity_min: "",
      capacity_max: "",
      free_min: "",
    });
    setPage(1);
  };

  const handleInput = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSort = useCallback(
    (col: string) => {
      if (col === "free" || col === "occupied") {
        // Enable client-side sorting
        setClientSort((prev) => ({
          enabled: true,
          field: col as "free" | "occupied",
        }));

        // Toggle order
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return;
      }

      // Server-sortable columns
      setClientSort({ enabled: false, field: null });

      if (sortBy === col) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(col);
        setSortOrder("asc");
      }

      setPage(1);
    },
    [sortBy]
  );

  // Build API URL — do NOT send client-sort field to server
  const query = Object.entries(filters)
    .filter(([k, v]) => {
      if (k === "free_min") return false; // handled on client
      return v !== "";
    })
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");

  const url =
    `/api/cells?${query}${query ? "&" : ""}page=${page}&limit=${limit}` +
    (clientSort.enabled ? "" : `&sortBy=${sortBy}&sortOrder=${sortOrder}`);

  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  // Compute free and occupied values
  let formatted = rows.map((cell: any) => {
    const prisoners = Array.isArray(cell.prisoners) ? cell.prisoners : [];
    const occupied = prisoners.length;
    const free = Number(cell.capacity) - occupied;

    return { ...cell, prisoners, occupied, free };
  });

  // Apply client free_min filter
  if (filters.free_min) {
    const min = Number(filters.free_min);
    formatted = formatted.filter((c) => c.free >= min);
  }

  // Apply client-side sorting
  if (clientSort.enabled && clientSort.field) {
    formatted = formatted.sort((a: any, b: any) => {
      if (sortOrder === "asc") return a[clientSort.field] - b[clientSort.field];
      else return b[clientSort.field] - a[clientSort.field];
    });
  }

  return (
    <Layout title="Cells">
      <FilterBar onReset={onReset}>
        <>
          <input
            name="blockName"
            placeholder="Block Name"
            value={filters.blockName}
            onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="capacity_min"
            placeholder="Min Capacity"
            type="number"
            value={filters.capacity_min}
            onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="capacity_max"
            placeholder="Max Capacity"
            type="number"
            value={filters.capacity_max}
            onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="free_min"
            placeholder="Min Free Space"
            type="number"
            value={filters.free_min}
            onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </>
      </FilterBar>

      <div className="flex justify-end mb-4">
        <a href="/cells/add" className="px-4 py-2 bg-blue-600 text-white rounded">
          + Add Cell
        </a>
      </div>

      <Table
        data={formatted}
        columns={["id", "blockName", "capacity", "occupied", "free"]}
        baseUrl="/cells"
        sortableColumns={["id", "blockName", "capacity", "occupied", "free"]}
        sortBy={clientSort.enabled ? clientSort.field! : sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Previous
        </button>

        <span>
          Page {data?.page || 1} of {data?.totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => (p < (data?.totalPages || 1) ? p + 1 : p))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
