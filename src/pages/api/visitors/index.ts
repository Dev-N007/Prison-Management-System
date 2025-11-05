import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const visitors = await prisma.visitor.findMany();
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
