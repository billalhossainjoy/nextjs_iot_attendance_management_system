import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get attendance records by date range
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    let end: Date;
    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // If no end date is provided, use the start date (with end of day)
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            fingerId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all employees
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        fingerId: true,
        name: true,
        email: true,
      },
    });

    // Map to track which employees have attendance in the date range
    const employeeAttendance = new Map();
    attendances.forEach((attendance) => {
      employeeAttendance.set(attendance.employeeId, true);
    });

    // Get absent employees
    const absentEmployees = employees.filter(
      (employee) => !employeeAttendance.has(employee.id)
    );

    return NextResponse.json(
      {
        startDate: start,
        endDate: end,
        present: attendances,
        absent: absentEmployees,
        totalPresent: attendances.length,
        totalAbsent: absentEmployees.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching attendance by date:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}
