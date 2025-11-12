import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { blockName, capacity_min, capacity_max } = req.query;

    const cells = await prisma.cell.findMany({
      where: {
        AND: [
          blockName ? { blockName: { contains: String(blockName) } } : {},
          capacity_min || capacity_max
            ? {
                capacity: {
                  gte: capacity_min ? Number(capacity_min) : undefined,
                  lte: capacity_max ? Number(capacity_max) : undefined
                }
              }
            : {}
        ]
      }
    });

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
