import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      name,
      gender,
      crime,
      status,
      age_min,
      age_max,
      cellId,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Number(page);
    const pageSize = Number(limit);

    const where: any = {};

    if (name) where.name = { contains: name as string, mode: "insensitive" };
    if (gender) where.gender = gender;
    if (crime) where.crime = { contains: crime as string, mode: "insensitive" };
    if (status) where.status = status;
    if (cellId) where.cellId = Number(cellId);

    if (age_min) where.age = { gte: Number(age_min) };
    if (age_max)
      where.age = { ...(where.age || {}), lte: Number(age_max) };

    const total = await prisma.prisoner.count({ where });

    const prisoners = await prisma.prisoner.findMany({
      where,
      include: { cell: true },
      orderBy: { [sortBy as string]: sortOrder },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return res.json({
      data: prisoners,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  if (req.method === "POST") {
    const { name, age, gender, crime, sentence, status, cellId } = req.body;

    const prisoner = await prisma.prisoner.create({
      data: {
        name,
        age: Number(age),
        gender,
        crime,
        sentence,
        status,
        cellId: cellId ? Number(cellId) : null,
      },
    });

    return res.json(prisoner);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
