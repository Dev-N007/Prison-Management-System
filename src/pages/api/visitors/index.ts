import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { name, relation, prisonerId, visit_before, visit_after } = req.query;

    const visitors = await prisma.visitor.findMany({
      where: {
        AND: [
          name ? { name: { contains: String(name) } } : {},
          relation ? { relation: { contains: String(relation) } } : {},
          prisonerId ? { prisonerId: Number(prisonerId) } : {},
          visit_before || visit_after
            ? {
                visitDate: {
                  lte: visit_before ? new Date(String(visit_before)) : undefined,
                  gte: visit_after ? new Date(String(visit_after)) : undefined
                }
              }
            : {}
        ]
      }
    });

    return res.json(visitors);
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
