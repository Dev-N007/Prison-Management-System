import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      name,
      relation,
      prisonerId,
      visit_from,
      visit_to,
      sortBy = "visitDate",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: any = {};

    if (name) where.name = { contains: name  };
    if (relation) where.relation = { contains: relation  };
    if (prisonerId) where.prisonerId = Number(prisonerId);

    if (visit_from) where.visitDate = { gte: new Date(visit_from as string) };
    if (visit_to)
      where.visitDate = { ...(where.visitDate || {}), lte: new Date(visit_to as string) };

    const pageNum = Number(page);
    const pageSize = Number(limit);

    const total = await prisma.visitor.count({ where });

    const visitors = await prisma.visitor.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return res.status(200).json({
      data: visitors,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  if (req.method === "POST") {
    const { name, relation, visitDate, prisonerId } = req.body;

    const v = await prisma.visitor.create({
      data: { name, relation, visitDate: new Date(visitDate), prisonerId },
    });

    return res.status(201).json(v);
  }

  res.status(405).json({ message: "Method not allowed" });
}
