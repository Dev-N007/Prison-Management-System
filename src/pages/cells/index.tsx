import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Cells() {
  const { data, isLoading } = useSWR("/api/cells", fetcher);

  return (
    <Layout title="Cells">
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
          <Table data={data || []} columns={["id", "blockName", "capacity"]}  baseUrl="/cells"/>
        )}
      </div>
    </Layout>
  );
}
