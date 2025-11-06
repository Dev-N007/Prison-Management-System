import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const staff = await prisma.staff.findUnique({ where: { id } });
    return res.json(staff);
  }

  if (req.method === "PUT") {
    const { name, role, shift } = req.body;
    const updated = await prisma.staff.update({
      where: { id },
      data: { name, role, shift },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.staff.delete({ where: { id } });
    return res.json({ message: "Staff deleted" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
