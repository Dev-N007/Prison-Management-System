import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export const Layout = ({ title, children }: any) => {
  return (
    <div>
      <Sidebar />
      <Topbar />

      <main className="md:ml-64 pt-20 px-6 pb-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <div className="bg-white p-6 rounded-xl shadow-xl border">
          {children}
        </div>
      </main>
    </div>
  );
};
