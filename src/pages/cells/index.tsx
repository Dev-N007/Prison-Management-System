import { useState } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Cells() {
  const [filters, setFilters] = useState({
    blockName: "",
    capacity_min: "",
    capacity_max: ""
  });

  const query = Object.entries(filters)
    .filter(([k, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, isLoading } = useSWR(`/api/cells?${query}`, fetcher);

  function handleChange(e: any) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Layout title="Cells">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input name="blockName" placeholder="Block Name"
          value={filters.blockName} onChange={handleChange}
          className="p-2 border rounded" />

        <input name="capacity_min" placeholder="Min Capacity" type="number"
          value={filters.capacity_min} onChange={handleChange}
          className="p-2 border rounded" />

        <input name="capacity_max" placeholder="Max Capacity" type="number"
          value={filters.capacity_max} onChange={handleChange}
          className="p-2 border rounded" />
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <a
          href="/cells/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Cell
        </a>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data || []} columns={["id", "blockName", "capacity"]} baseUrl="/cells" />
        )}
      </div>
    </Layout>
  );
}
