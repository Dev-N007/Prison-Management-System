import { useState } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Staff() {
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    shift: ""
  });

  const query = Object.entries(filters)
    .filter(([k, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, isLoading } = useSWR(`/api/staff?${query}`, fetcher);

  function handleChange(e: any) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Layout title="Staff">
      
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input name="name" placeholder="Name"
          value={filters.name} onChange={handleChange}
          className="p-2 border rounded" />

        <input name="role" placeholder="Role"
          value={filters.role} onChange={handleChange}
          className="p-2 border rounded" />

        <select name="shift" value={filters.shift}
          onChange={handleChange} className="p-2 border rounded">
          <option value="">Shift</option>
          <option>Morning</option>
          <option>Evening</option>
          <option>Night</option>
        </select>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <a
          href="/staff/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Staff
        </a>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data || []} columns={["id", "name", "role", "shift"]} baseUrl="/staff" />
        )}
      </div>
    </Layout>
  );
}
