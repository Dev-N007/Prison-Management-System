import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { name, role, shift } = req.query;

    const staff = await prisma.staff.findMany({
      where: {
        AND: [
          name ? { name: { contains: String(name) } } : {},
          role ? { role: String(role) } : {},
          shift ? { shift: String(shift) } : {}
        ]
      }
    });

    return res.json(staff);
  }

  if (req.method === "POST") {
    const { name, role, shift } = req.body;
    const s = await prisma.staff.create({
      data: { name, role, shift },
    });
    return res.status(201).json(s);
  }

  res.status(405).json({ message: "Method not allowed" });
}
