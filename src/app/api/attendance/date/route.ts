import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get attendance records by date range
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const employeeId = searchParams.get("employeeId");

    if (!startDate) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    let end = new Date(start);
    end.setHours(23, 59, 59, 999);

    // Build the where clause
    const whereClause: any = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    // Add employee filter if specified
    if (employeeId && employeeId !== "all") {
      whereClause.employeeId = employeeId;
    }

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
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

    // Get all employees for absent calculation
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
