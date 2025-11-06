import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Prisoners() {
  const { data, error } = useSWR("/api/prisoners", fetcher);

  if (error) return <Layout>Error loading data</Layout>;
  if (!data) return <Layout>Loading...</Layout>;

  // ✅ Transform table display: show block name instead of raw cellId
  const formatted = data.map((p: any) => ({
    ...p,
    cell: p.cell?.blockName || "Unassigned",
  }));

  return (
    <Layout title="Prisoners">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Prisoners</h2>
        <Link
          href="/prisoners/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
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
