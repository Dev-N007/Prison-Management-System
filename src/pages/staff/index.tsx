import { useState, useCallback } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Staff() {
  const [filters, setFilters] = useState({ name: "", role: "", shift: "" });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc" as "asc" | "desc");

  const onReset = () => {
    setFilters({ name: "", role: "", shift: "" });
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

  const url = `/api/staff?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  
  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  return (
    <Layout title="Staff">
      <FilterBar onReset={onReset}>
        <>
          <input name="name" placeholder="Name" value={filters.name} onChange={handleInput} className="p-2 border rounded" />
          <input name="role" placeholder="Role" value={filters.role} onChange={handleInput} className="p-2 border rounded" />
          <select name="shift" value={filters.shift} onChange={handleInput} className="p-2 border rounded">
            <option value="">Shift</option><option>Morning</option><option>Evening</option><option>Night</option>
          </select>
        </>
      </FilterBar>

      <div className="flex justify-end mb-4">
        <a href="/staff/add" className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Staff</a>
      </div>

      <Table
        data={rows}
        columns={["id", "name", "role", "shift"]}
        baseUrl="/staff"
        sortableColumns={["id", "name", "role", "shift"]}
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
