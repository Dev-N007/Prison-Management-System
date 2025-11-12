import { useState, useCallback } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Visitors() {
  const [filters, setFilters] = useState({
    name: "",
    relation: "",
    prisonerId: "",
    visit_from: "",
    visit_to: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("visitDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const onReset = () => {
    setFilters({
      name: "",
      relation: "",
      prisonerId: "",
      visit_from: "",
      visit_to: "",
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

  const url = `/api/visitors?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  return (
    <Layout title="Visitors">
      <FilterBar onReset={onReset}>
        <>
          <input name="name" placeholder="Visitor Name" value={filters.name} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="relation" placeholder="Relation" value={filters.relation} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <input name="prisonerId" placeholder="Prisoner ID" value={filters.prisonerId} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

         <div className="flex flex-col">
  <label className="text-xs text-gray-600 mb-1">Visit Date (From)</label>
  <input name="visit_from" type="date" value={filters.visit_from} onChange={handleInput}
    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
</div>

<div className="flex flex-col">
  <label className="text-xs text-gray-600 mb-1">Visit Date (To)</label>
  <input name="visit_to" type="date" value={filters.visit_to} onChange={handleInput}
    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
</div>

        </>
      </FilterBar>

      <div className="flex justify-end mb-4">
        <a href="/visitors/add" className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Visitor</a>
      </div>

      <Table
        data={rows}
        columns={["id", "name", "relation", "visitDate", "prisonerId"]}
        baseUrl="/visitors"
        sortableColumns={["id", "name", "visitDate", "prisonerId"]}
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
