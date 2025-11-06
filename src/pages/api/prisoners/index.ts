import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Get all prisoners
  if (req.method === "GET") {
    const prisoners = await prisma.prisoner.findMany({
      include: { cell: true }, // ✅ show cell blockName
    });
    return res.json(prisoners);
  }

  // ✅ Create a prisoner
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
