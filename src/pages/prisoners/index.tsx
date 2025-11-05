import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Prisoners() {
  const { data, isLoading } = useSWR("/api/prisoners", fetcher);

  return (
    <Layout title="Prisoners">
      <div className="flex justify-end">
        <a
          href="/prisoners/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Prisoner
        </a>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={data || []}
            columns={["id", "name", "age", "gender", "crime", "status"]}
          />
        )}
      </div>
    </Layout>
  );
}
