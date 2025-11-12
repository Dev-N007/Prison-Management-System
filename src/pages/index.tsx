import useSWR from "swr";
import { Layout } from "@/components/Layout";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { data, error } = useSWR("/api/dashboard", fetcher);

  if (error) return <Layout>Error loading dashboard...</Layout>;
  if (!data) return <Layout>Loading...</Layout>;

  return (
    <Layout title="Dashboard">
      
      {/* Prisoner Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <a
          href="/prisoners?autoStatus=Active"
          className="bg-white shadow-lg border rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
        >
          <p className="text-gray-500 text-sm uppercase">Active Prisoners</p>
          <h2 className="text-3xl font-bold text-blue-600">{data.active}</h2>
        </a>

        <a
          href="/prisoners?autoStatus=Released"
          className="bg-white shadow-lg border rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
        >
          <p className="text-gray-500 text-sm uppercase">Released Prisoners</p>
          <h2 className="text-3xl font-bold text-blue-600">{data.released}</h2>
        </a>

        <a
          href="/prisoners?autoStatus=Transferred"
          className="bg-white shadow-lg border rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
        >
          <p className="text-gray-500 text-sm uppercase">Transferred Prisoners</p>
          <h2 className="text-3xl font-bold text-blue-600">{data.transferred}</h2>
        </a>
      </div>

      {/* Cells with space */}
      <h2 className="text-xl font-bold mb-2 cursor-pointer hover:underline">
        <a href="/cells?autoSort=free">Cells with Most Available Space</a>
      </h2>

      <table
        className="w-full mb-8 bg-white rounded-xl border shadow cursor-pointer"
        onClick={() => (window.location.href = "/cells?autoSort=free")}
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Block</th>
            <th className="p-3">Capacity</th>
            <th className="p-3">Occupied</th>
            <th className="p-3">Free</th>
          </tr>
        </thead>

        <tbody>
          {data.availableCells
            ?.sort((a: any, b: any) => b.free - a.free)
            .slice(0, 5)
            .map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.blockName}</td>
                <td className="p-3">{c.capacity}</td>
                <td className="p-3">{c.used}</td>
                <td className="p-3 text-green-600 font-semibold">{c.free}</td>
              </tr>
            ))}

          {(!data.availableCells || data.availableCells.length === 0) && (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                No cell data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Last visitors */}
      <h2 className="text-xl font-bold mb-2 cursor-pointer hover:underline">
        <a href="/visitors?autoSort=visitDate_desc">Last 5 Visitors</a>
      </h2>

      <table className="w-full mb-8 bg-white rounded-xl border shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Visitor</th>
            <th className="p-3">Relation</th>
            <th className="p-3">Prisoner</th>
            <th className="p-3">Visited On</th>
          </tr>
        </thead>
        <tbody>
          {data.lastVisitors?.length ? (
            data.lastVisitors.map((v: any) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.relation}</td>
                <td className="p-3">{v.prisoner?.name}</td>
                <td className="p-3">{v.visitDate?.substring(0, 10)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                No visitors recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Upcoming Hearings */}
      <h2 className="text-xl font-bold mb-2 cursor-pointer hover:underline">
        <a href="/cases?autoSort=hearingDate_asc">Upcoming Case Hearings</a>
      </h2>

      <table className="w-full bg-white rounded-xl border shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Case Title</th>
            <th className="p-3">Prisoner</th>
            <th className="p-3">Hearing Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.upcomingCases?.length ? (
            data.upcomingCases.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.prisoner?.name}</td>
                <td className="p-3">{c.hearingDate.substring(0, 10)}</td>
                <td className="p-3">{c.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                No upcoming cases
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </Layout>
  );
}
