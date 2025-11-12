import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { name, gender, crime, status, cellId, age_min, age_max } = req.query;

    const prisoners = await prisma.prisoner.findMany({
      where: {
        AND: [
          name ? { name: { contains: String(name) } } : {},
          gender ? { gender: String(gender) } : {},
          crime ? { crime: { contains: String(crime) } } : {},
          status ? { status: String(status) } : {},
          cellId ? { cellId: Number(cellId) } : {},
          age_min || age_max
            ? {
                age: {
                  gte: age_min ? Number(age_min) : undefined,
                  lte: age_max ? Number(age_max) : undefined
                }
              }
            : {}
        ]
      },
      include: { cell: true },
    });

    return res.json(prisoners);
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
