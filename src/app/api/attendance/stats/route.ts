import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get attendance statistics
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total employees
    const totalEmployees = await prisma.employee.count();

    // Get today's attendance stats
    const todayStats = await prisma.attendance.groupBy({
      by: ["status"],
      where: {
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Initialize stats
    const stats = {
      totalEmployees,
      presentToday: 0,
      lateToday: 0,
      absentToday: 0,
    };

    // Update stats based on today's attendance
    todayStats.forEach((stat) => {
      switch (stat.status) {
        case "present":
          stats.presentToday = stat._count._all;
          break;
        case "late":
          stats.lateToday = stat._count._all;
          break;
        case "absent":
          stats.absentToday = stat._count._all;
          break;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance stats" },
      { status: 500 }
    );
  }
}
