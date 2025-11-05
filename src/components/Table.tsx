export const Table = ({ data, columns }: any) => (
  <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
    <thead>
      <tr className="bg-gray-200">
        {columns.map((c: string) => (
          <th
            key={c}
            className="px-4 py-3 text-left text-gray-700 font-semibold uppercase text-sm"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {data.map((row: any, i: number) => (
        <tr key={i} className="border-b hover:bg-gray-50">
          {columns.map((c: string) => (
            <td key={c} className="px-4 py-3">
              {row[c]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
