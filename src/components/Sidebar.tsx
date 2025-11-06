import Link from "next/link";

export default function Sidebar() {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/prisoners", label: "Prisoners" },
    { href: "/cells", label: "Cells" },
    { href: "/staff", label: "Staff" },
    { href: "/visitors", label: "Visitors" },
    { href: "/cases", label: "Cases" },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r h-screen fixed left-0 top-0 shadow-xl">
      <div className="px-6 py-8 w-full">
        <h2 className="text-2xl font-bold">Prison Management System</h2>
        <p className="text-gray-500 text-sm">Admin Console</p>

        <nav className="mt-8 space-y-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
