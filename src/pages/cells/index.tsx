import { useState, useCallback } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Cells() {
  const [filters, setFilters] = useState({
    blockName: "",
    capacity_min: "",
    capacity_max: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const onReset = () => {
    setFilters({ blockName: "", capacity_min: "", capacity_max: "" });
    setPage(1);
  };

  const handleInput = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSort = useCallback(
    (col: string) => {
      if (sortBy === col) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      else {
        setSortBy(col);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [sortBy]
  );

  const query = Object.entries(filters)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");

  const url = `/api/cells?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  const formatted = rows.map((cell: any) => {
  const prisoners = Array.isArray(cell.prisoners) ? cell.prisoners : [];

  return {
    ...cell,
    occupied: prisoners.length,
    prisonerIds:
      prisoners.length > 0
        ? prisoners.map((p: any) => p.id).join(", ")
        : "None",
  };
});


  return (
    <Layout title="Cells">
      <FilterBar onReset={onReset}>
        <>
          <input name="blockName" placeholder="Block Name" value={filters.blockName} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="capacity_min" placeholder="Min Capacity" type="number" value={filters.capacity_min} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="capacity_max" placeholder="Max Capacity" type="number" value={filters.capacity_max} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
        </>
      </FilterBar>

      <div className="flex justify-end mb-4">
        <a href="/cells/add" className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Cell</a>
      </div>

      <Table
        data={formatted}
        columns={["id", "blockName", "capacity", "occupied", "prisoner_Ids"]}   // UPDATED
        baseUrl="/cells"
        sortableColumns={["id", "blockName", "capacity", "occupied"]}         // UPDATED
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded">Previous</button>
        <span>Page {data?.page || 1} of {data?.totalPages || 1}</span>
        <button onClick={() => setPage((p) => (p < (data?.totalPages || 1) ? p + 1 : p))} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </Layout>
  );
}
