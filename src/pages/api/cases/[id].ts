import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const record = await prisma.caseRecord.findUnique({ where: { id } });
    return res.json(record);
  }

  if (req.method === "PUT") {
    const { title, status, hearing_date, prisoner_id } = req.body;
    const updated = await prisma.caseRecord.update({
      where: { id },
      data: {
        title,
        status,
        hearingDate: new Date(hearing_date),
        prisonerId: Number(prisoner_id),
      },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.caseRecord.delete({ where: { id } });
    return res.json({ message: "Case deleted" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
