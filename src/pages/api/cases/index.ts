import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { title, status, hearingDate, prisonerId, hearing_before, hearing_after } = req.query;

    const cases = await prisma.caseRecord.findMany({
      where: {
        AND: [
          title ? { title: { contains: String(title)} } : {},
          status ? { status: String(status) } : {},
          hearingDate ? { hearingDate: new Date(String(hearingDate)) } : {},
          hearing_before || hearing_after
            ? {
                hearingDate: {
                  lte: hearing_before ? new Date(String(hearing_before)) : undefined,
                  gte: hearing_after ? new Date(String(hearing_after)) : undefined
                }
              }
            : {},
          prisonerId ? { prisonerId: Number(prisonerId) } : {}
        ]
      }
    });

    return res.json(cases);
  }

  if (req.method === "POST") {
    const { title, status, hearingDate, prisonerId } = req.body;
    const c = await prisma.caseRecord.create({
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
