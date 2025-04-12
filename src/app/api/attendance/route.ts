import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Retrieve all attendance records
export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
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
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

// POST - Create a new attendance record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, status, notes } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        status: status || "present",
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
    console.error("Error creating attendance record:", error);
    return NextResponse.json(
      { error: "Failed to create attendance record" },
      { status: 500 }
    );
  }
}
