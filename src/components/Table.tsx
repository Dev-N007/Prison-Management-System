export const Table = ({ data, columns, baseUrl }: any) => (
  <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
    <thead>
      <tr className="bg-gray-200">
        {columns.map((c: string) => (
          <th key={c} className="px-4 py-3 text-left text-gray-700 font-semibold uppercase text-sm">
            {c}
          </th>
        ))}
        <th className="px-4 py-3 text-left text-gray-700 font-semibold uppercase text-sm">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      {data.map((row: any) => (
        <tr key={row.id} className="border-b hover:bg-gray-50">
          {columns.map((c: string) => (
            <td key={c} className="px-4 py-3">{row[c]}</td>
          ))}

          <td className="px-4 py-3 space-x-2">
            <a
              href={`${baseUrl}/edit/${row.id}`}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              Edit
            </a>

            <a
              href={`${baseUrl}/delete/${row.id}`}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
