import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const cases = await prisma.case.findMany();
    return res.json(cases);
  }

  if (req.method === "POST") {
    const { title, status, hearingDate, prisonerId } = req.body;
    const c = await prisma.case.create({
      data: {
        title,
        status,
        hearingDate: new Date(hearingDate),
        prisonerId,
      },
    });
    return res.status(201).json(c);
  }

  res.status(405).json({ message: "Method not allowed" });
}
