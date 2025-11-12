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

  const query = Object.entries(filters)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");

  const url = `/api/prisoners?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  const { data } = useSWR(url, fetcher);

  if (!data) return <Layout>Loading...</Layout>;

  const rows = Array.isArray(data) ? data : data.data || [];

  const formatted = rows.map((p: any) => ({
    ...p,
    cell: p.cell?.blockName || "Unassigned",
  }));

  return (
    <Layout title="Prisoners">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Prisoners</h1>
        <Link href="/prisoners/add" className="px-4 py-2 bg-blue-600 text-white rounded">
          + Add Prisoner
        </Link>
      </div>

      <FilterBar onReset={onReset}>
        <>
          <input name="name" placeholder="Name" value={filters.name} onChange={handleInput} className="p-2 border rounded" />
          <select name="gender" value={filters.gender} onChange={handleInput} className="p-2 border rounded">
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input name="crime" placeholder="Crime" value={filters.crime} onChange={handleInput} className="p-2 border rounded" />
          <select name="status" value={filters.status} onChange={handleInput} className="p-2 border rounded">
            <option value="">Status</option><option>Active</option><option>Released</option><option>Transferred</option>
          </select>
          <input name="age_min" placeholder="Min Age" type="number" value={filters.age_min} onChange={handleInput} className="p-2 border rounded" />
          <input name="age_max" placeholder="Max Age" type="number" value={filters.age_max} onChange={handleInput} className="p-2 border rounded" />
          <input name="cellId" placeholder="Cell ID" value={filters.cellId} onChange={handleInput} className="p-2 border rounded" />
        </>
      </FilterBar>

      <Table
        data={formatted}
        columns={["id", "name", "age", "gender", "crime", "sentence", "status", "cell"]}
        baseUrl="/prisoners"
        sortableColumns={["id", "name", "age", "status"]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="flex justify-between mt-4">
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Previous
        </button>

        <span>Page {data.page || 1} of {data.totalPages || 1}</span>

        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => (p < (data.totalPages || 1) ? p + 1 : p))}>
          Next
        </button>
      </div>
    </Layout>
  );
}
