import { useState, useCallback } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Prisoners() {
  const [filters, setFilters] = useState({
    name: "",
    gender: "",
    crime: "",
    status: "",
    age_min: "",
    age_max: "",
    cellId: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc" as "asc" | "desc");

  const onReset = () => {
    setFilters({
      name: "",
      gender: "",
      crime: "",
      status: "",
      age_min: "",
      age_max: "",
      cellId: "",
    });
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

  const url = `/api/prisoners?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  const formatted = rows.map((p: any) => ({
    ...p,
    cell: p.cellId ? p.cellId : "Unassigned",  // changed to show cellId
  }));

  return (
    <Layout title="Prisoners">

      {/* Filters FIRST (same as other pages) */}
      <FilterBar onReset={onReset}>
        <>
          <input name="name" placeholder="Name" value={filters.name} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <select name="gender" value={filters.gender} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>

          <input name="crime" placeholder="Crime" value={filters.crime} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <select name="status" value={filters.status} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">Status</option><option>Active</option><option>Released</option><option>Transferred</option>
          </select>

          <input name="age_min" placeholder="Min Age" type="number" value={filters.age_min} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="age_max" placeholder="Max Age" type="number" value={filters.age_max} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="cellId" placeholder="Cell ID" value={filters.cellId} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
        </>
      </FilterBar>

      {/* Add Prisoner button – placed BELOW filters just like other pages */}
      <div className="flex justify-end mb-4">
        <Link href="/prisoners/add" className="px-4 py-2 bg-blue-600 text-white rounded">
          + Add Prisoner
        </Link>
      </div>

      <Table
        data={formatted}
        columns={["id", "name", "age", "gender", "crime", "sentence", "status", "cell_Id"]}
        baseUrl="/prisoners"
        sortableColumns={["id", "name", "age", "status","cell_Id"]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="flex justify-between mt-4">
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
        <span>Page {data?.page || 1} of {data?.totalPages || 1}</span>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => (p < (data?.totalPages || 1) ? p + 1 : p))}>Next</button>
      </div>

    </Layout>
  );
}
