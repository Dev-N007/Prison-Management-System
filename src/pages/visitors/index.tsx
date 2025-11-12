import { useState } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Visitors() {
  const [filters, setFilters] = useState({
    name: "",
    relation: "",
    prisonerId: "",
    visit_before: "",
    visit_after: ""
  });

  const query = Object.entries(filters)
    .filter(([k, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, isLoading } = useSWR(`/api/visitors?${query}`, fetcher);

  function handleChange(e: any) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Layout title="Visitors">

      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          name="name"
          placeholder="Visitor Name"
          value={filters.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="relation"
          placeholder="Relation"
          value={filters.relation}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="prisonerId"
          placeholder="Prisoner ID"
          value={filters.prisonerId}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="visit_before"
          type="date"
          value={filters.visit_before}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="visit_after"
          type="date"
          value={filters.visit_after}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Add Visitor Button */}
      <div className="flex justify-end">
        <a
          href="/visitors/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Visitor
        </a>
      </div>

      {/* Table Section */}
      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={data || []}
            columns={["id", "name", "relation", "visitDate", "prisonerId"]}
            baseUrl="/visitors"
          />
        )}
      </div>
    </Layout>
  );
}
