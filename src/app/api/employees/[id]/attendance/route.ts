import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// GET - Get attendance records for a specific employee
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
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
        employeeId: id,
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

    return NextResponse.json(attendances, { status: 200 });
  } catch (error) {
    console.error(`Error fetching attendance for employee:`, error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

// POST - Create a new attendance record for an employee
export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { checkIn, checkOut, status, notes } = body;

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: id,
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : null,
        status,
        notes,
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
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error(`Error creating attendance for employee:`, error);
    return NextResponse.json(
      { error: "Failed to create attendance record" },
      { status: 500 }
    );
  }
}
