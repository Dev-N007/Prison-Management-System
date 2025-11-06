import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const total = await prisma.prisoner.count();
    const active = await prisma.prisoner.count({ where: { status: "Active" } });
    const released = await prisma.prisoner.count({ where: { status: "Released" } });
    const transferred = await prisma.prisoner.count({ where: { status: "Transferred" } });

    const cells = await prisma.cell.findMany({
      include: {
        _count: {
          select: { prisoners: true },
        },
      },
    });

    const availableCells = cells.map(c => ({
      id: c.id,
      blockName: c.blockName,
      capacity: c.capacity,
      used: c._count.prisoners,
      free: c.capacity - c._count.prisoners,
    }));

    const lastVisitors = await prisma.visitor.findMany({
      orderBy: { visitDate: "desc" },
      take: 5,
      include: { prisoner: true },
    });

    const upcomingCases = await prisma.caseRecord.findMany({
      where: { hearingDate: { gte: new Date() } },
      orderBy: { hearingDate: "asc" },
      take: 5,
      include: { prisoner: true },
    });

    res.status(200).json({
      totalPrisoners: total,
      active,
      released,
      transferred,
      availableCells,
      lastVisitors,
      upcomingCases,
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
