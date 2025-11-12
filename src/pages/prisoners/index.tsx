import { useState } from "react";
import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
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
    cellId: ""
  });

  const query = Object.entries(filters)
    .filter(([k, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, error } = useSWR(`/api/prisoners?${query}`, fetcher);

  if (error) return <Layout>Error loading data</Layout>;
  if (!data) return <Layout>Loading...</Layout>;

  const formatted = data.map((p: any) => ({
    ...p,
    cell: p.cell?.blockName || "Unassigned",
  }));

  function handleChange(e: any) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Layout title="Prisoners">
      
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input name="name" placeholder="Name"
          value={filters.name} onChange={handleChange}
          className="p-2 border rounded" />

        <select name="gender" value={filters.gender}
          onChange={handleChange} className="p-2 border rounded">
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input name="crime" placeholder="Crime"
          value={filters.crime} onChange={handleChange}
          className="p-2 border rounded" />

        <select name="status" value={filters.status}
          onChange={handleChange} className="p-2 border rounded">
          <option value="">Status</option>
          <option>Active</option>
          <option>Released</option>
          <option>Transferred</option>
        </select>

        <input name="age_min" placeholder="Min Age" type="number"
          value={filters.age_min} onChange={handleChange}
          className="p-2 border rounded" />

        <input name="age_max" placeholder="Max Age" type="number"
          value={filters.age_max} onChange={handleChange}
          className="p-2 border rounded" />

        <input name="cellId" placeholder="Cell ID"
          value={filters.cellId} onChange={handleChange}
          className="p-2 border rounded" />
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Prisoners</h2>
        <Link href="/prisoners/add" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          + Add Prisoner
        </Link>
      </div>

      <Table
        data={formatted}
        columns={[
          "id",
          "name",
          "age",
          "gender",
          "crime",
          "sentence",
          "status",
          "cell",
        ]}
        baseUrl="/prisoners"
      />
    </Layout>
  );
}
