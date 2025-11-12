import { useState, useCallback } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import Table from "@/components/Table";
import FilterBar from "@/components/FilterBar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Cases() {
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    prisonerId: "",
    hearing_from: "",
    hearing_to: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("hearingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const onReset = () => {
    setFilters({
      title: "",
      status: "",
      prisonerId: "",
      hearing_from: "",
      hearing_to: "",
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

  const url = `/api/cases?${query}${query ? "&" : ""}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  const { data } = useSWR(url, fetcher);

  const rows = Array.isArray(data) ? data : data?.data || [];

  return (
    <Layout title="Case Records">
      <FilterBar onReset={onReset}>
        <>
          <input name="title" placeholder="Case Title" value={filters.title} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

          <select name="status" value={filters.status} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">Status</option><option>Open</option><option>Closed</option><option>Pending</option>
          </select>

          <input name="prisonerId" placeholder="Prisoner ID" value={filters.prisonerId} onChange={handleInput}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

         <div className="flex flex-col">
  <label className="text-xs text-gray-600 mb-1">Hearing Date (From)</label>
  <input name="hearing_from" type="date" value={filters.hearing_from} onChange={handleInput}
    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
</div>

<div className="flex flex-col">
  <label className="text-xs text-gray-600 mb-1">Hearing Date (To)</label>
  <input name="hearing_to" type="date" value={filters.hearing_to} onChange={handleInput}
    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
</div>

        </>
      </FilterBar>

      <div className="flex justify-end mb-4">
        <a href="/cases/add" className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Case</a>
      </div>

      <Table
        data={rows}
        columns={["id", "title", "status", "hearingDate", "prisonerId"]}
        baseUrl="/cases"
        sortableColumns={["id", "title", "status", "hearingDate", "prisonerId"]}
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
