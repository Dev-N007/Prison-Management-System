import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const visitor = await prisma.visitor.findUnique({ where: { id } });
    return res.json(visitor);
  }

  if (req.method === "PUT") {
    const { name, relation, visit_date, prisoner_id } = req.body;
    const updated = await prisma.visitor.update({
      where: { id },
      data: {
        name,
        relation,
        visitDate: new Date(visit_date),
        prisonerId: Number(prisoner_id),
      },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.visitor.delete({ where: { id } });
    return res.json({ message: "Visitor deleted" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
