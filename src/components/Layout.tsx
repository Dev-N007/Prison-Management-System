import Sidebar from "./Sidebar";
import TopBar from "./Topbar";

export function Layout({ title, children }: any) {
  return (
    <div className="flex">
      <Sidebar />
      <TopBar />

      <main className="flex-1 p-6 md:ml-64 mt-14 md:mt-0 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
