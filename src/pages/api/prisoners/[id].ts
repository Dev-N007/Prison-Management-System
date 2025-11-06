import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const p = await prisma.prisoner.findUnique({ where: { id } });
    return res.json(p);
  }

  if (req.method === "PUT") {
    const { name, age, gender, crime, sentence, status } = req.body;
    const updated = await prisma.prisoner.update({
      where: { id },
      data: { name, age: Number(age), gender, crime, sentence, status },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.prisoner.delete({ where: { id } });
    return res.json({ message: "Prisoner deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
