import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      title,
      status,
      prisonerId,
      hearing_from,
      hearing_to,
      sortBy = "hearingDate",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: any = {};

    if (title) where.title = { contains: title as string, mode: "insensitive" };
    if (status) where.status = status;
    if (prisonerId) where.prisonerId = Number(prisonerId);

    if (hearing_from) where.hearingDate = { gte: new Date(hearing_from as string) };
    if (hearing_to)
      where.hearingDate = { ...(where.hearingDate || {}), lte: new Date(hearing_to as string) };

    const pageNum = Number(page);
    const pageSize = Number(limit);

    const total = await prisma.caseRecord.count({ where });

    const cases = await prisma.caseRecord.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return res.json({
      data: cases,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  if (req.method === "POST") {
    const { title, status, hearingDate, prisonerId } = req.body;

    const created = await prisma.caseRecord.create({
      data: {
        title,
        status,
        hearingDate: new Date(hearingDate),
        prisonerId,
      },
    });

    return res.status(201).json(created);
  }

  res.status(405).json({ message: "Method not allowed" });
}
