import { Layout } from "@/components/Layout";

export default function Home() {
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm uppercase">Prisoners</p>
          <h2 className="text-4xl font-bold text-blue-600">32</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm uppercase">Staff</p>
          <h2 className="text-4xl font-bold text-green-600">10</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm uppercase">Cells</p>
          <h2 className="text-4xl font-bold text-purple-600">8</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm uppercase">Visitors</p>
          <h2 className="text-4xl font-bold text-orange-600">45</h2>
        </div>
      </div>
    </Layout>
  );
}
