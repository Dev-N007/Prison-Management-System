import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const cells = await prisma.cell.findMany();
    return res.json(cells);
  }

  if (req.method === "POST") {
    const { blockName, capacity } = req.body;
    const newCell = await prisma.cell.create({
      data: { blockName, capacity: Number(capacity) },
    });
    return res.status(201).json(newCell);
  }

  res.status(405).json({ message: "Method not allowed" });
}
