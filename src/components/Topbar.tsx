import Link from "next/link";

export default function TopBar() {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/prisoners", label: "Prisoners" },
    { href: "/cells", label: "Cells" },
    { href: "/staff", label: "Staff" },
    { href: "/visitors", label: "Visitors" },
    { href: "/cases", label: "Cases" },
  ];

  return (
    <nav className="md:hidden fixed top-0 left-0 w-full bg-white shadow z-40 p-3 flex items-center overflow-x-auto whitespace-nowrap space-x-4">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm px-3 py-2 rounded-lg font-medium hover:bg-gray-100 whitespace-nowrap"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
