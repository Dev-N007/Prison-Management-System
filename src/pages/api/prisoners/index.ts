import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const prisoners = await prisma.prisoner.findMany();
    return res.json(prisoners);
  }

  if (req.method === "POST") {
    const { name, age, gender, crime, sentence } = req.body;
    const newP = await prisma.prisoner.create({
      data: { name, age: Number(age), gender, crime, sentence },
    });
    return res.status(201).json(newP);
  }

  res.status(405).json({ message: "Method not allowed" });
}
