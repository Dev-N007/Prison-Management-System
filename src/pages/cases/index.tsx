import { useState } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Cases() {
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    prisonerId: "",
    hearing_before: "",
    hearing_after: ""
  });

  const query = Object.entries(filters)
    .filter(([k, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, isLoading } = useSWR(`/api/cases?${query}`, fetcher);

  function handleChange(e: any) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Layout title="Case Records">
      <div className="flex flex-col gap-4 mb-6">

        {/* Filters Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input name="title" placeholder="Case Title"
            value={filters.title} onChange={handleChange}
            className="p-2 border rounded" />

          <select name="status" value={filters.status}
            onChange={handleChange} className="p-2 border rounded">
            <option value="">Status</option>
            <option>Open</option>
            <option>Closed</option>
            <option>Pending</option>
          </select>

          <input name="prisonerId" placeholder="Prisoner ID"
            value={filters.prisonerId} onChange={handleChange}
            className="p-2 border rounded" />

          <input name="hearing_before" type="date"
            value={filters.hearing_before} onChange={handleChange}
            className="p-2 border rounded" />

          <input name="hearing_after" type="date"
            value={filters.hearing_after} onChange={handleChange}
            className="p-2 border rounded" />
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <a
            href="/cases/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            + Add Case
          </a>
        </div>
      </div>

      <div className="mt-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={data || []}
            columns={["id", "title", "status", "hearingDate", "prisonerId"]}
            baseUrl="/cases"
          />
        )}
      </div>
    </Layout>
  );
}
