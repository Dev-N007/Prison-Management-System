import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const cell = await prisma.cell.findUnique({ where: { id } });
    return res.json(cell);
  }

  if (req.method === "PUT") {
    const { blockName, capacity } = req.body;

    const updated = await prisma.cell.update({
      where: { id },
      data: {
        blockName,             // ✅ correct camelCase
        capacity: Number(capacity),
      },
    });

    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.cell.delete({ where: { id } });
    return res.json({ message: "Cell deleted" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
