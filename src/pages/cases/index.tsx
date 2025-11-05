import useSWR from "swr";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Cases() {
  const { data, isLoading } = useSWR("/api/cases", fetcher);

  return (
    <Layout title="Case Records">
      <div className="flex justify-end">
        <a
          href="/cases/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Case
        </a>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data || []} columns={["id", "title", "status", "hearingDate", "prisonerId"]} />
        )}
      </div>
    </Layout>
  );
}
