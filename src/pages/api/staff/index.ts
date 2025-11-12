import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      name,
      role,
      shift,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: any = {};

    if (name) where.name = { contains: name };
    if (role) where.role = { contains: role };
    if (shift) where.shift = shift;

    const pageNum = Number(page);
    const pageSize = Number(limit);

    const total = await prisma.staff.count({ where });

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return res.status(200).json({
      data: staff,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  if (req.method === "POST") {
    const { name, role, shift } = req.body;

    const s = await prisma.staff.create({
      data: { name, role, shift },
    });

    return res.status(201).json(s);
  }

  res.status(405).json({ message: "Method not allowed" });
}
