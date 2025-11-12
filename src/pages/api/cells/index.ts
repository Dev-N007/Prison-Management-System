import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      blockName,
      capacity_min,
      capacity_max,
      sortBy = "id",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: any = {};

    if (blockName)
      where.blockName = { contains: blockName };

    if (capacity_min) where.capacity = { gte: Number(capacity_min) };
    if (capacity_max)
      where.capacity = { ...(where.capacity || {}), lte: Number(capacity_max) };

    const pageNum = Number(page);
    const pageSize = Number(limit);

    const total = await prisma.cell.count({ where });

    const cells = await prisma.cell.findMany({
      where,
      include: {
        prisoners: { select: { id: true } },   // << ADDED
      },
      orderBy: { [sortBy as string]: sortOrder },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return res.json({
      data: cells,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
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
