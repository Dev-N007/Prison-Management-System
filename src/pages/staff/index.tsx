import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Staff() {
  const { data, isLoading } = useSWR("/api/staff", fetcher);

  return (
    <Layout title="Staff">
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
          <Table data={data || []} columns={["id", "name", "role", "shift"]}  baseUrl="/staff"/>
        )}
      </div>
    </Layout>
  );
}
