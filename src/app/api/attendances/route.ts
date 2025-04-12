import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const employeeId = searchParams.get("employeeId");

    const where: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.checkIn = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (employeeId && employeeId !== "all") {
      where.employeeId = employeeId;
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendances" },
      { status: 500 }
    );
  }
}
