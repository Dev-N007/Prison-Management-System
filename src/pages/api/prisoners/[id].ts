import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const record = await prisma.prisoner.findUnique({ where: { id } });
    return res.json(record);
  }

  if (req.method === "PUT") {
    const updated = await prisma.prisoner.update({
      where: { id },
      data: req.body,
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.prisoner.delete({ where: { id } });
    return res.json({ message: "Deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
