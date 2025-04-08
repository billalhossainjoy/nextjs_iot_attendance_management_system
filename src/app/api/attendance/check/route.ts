import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Mark attendance using finger ID
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fingerId } = body;

    if (!fingerId) {
      return NextResponse.json(
        { error: "Finger ID is required" },
        { status: 400 }
      );
    }

    // Find employee by finger ID
    const employee = await prisma.employee.findFirst({
      where: { fingerId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "No employee found with this finger ID" },
        { status: 404 }
      );
    }

    // Check if employee has already marked attendance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          message: "Attendance already marked for today",
          employee: {
            id: employee.id,
            name: employee.name,
            fingerId: employee.fingerId,
            email: employee.email,
          },
          attendance: existingAttendance,
        },
        { status: 200 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
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

    return NextResponse.json(
      {
        message: "Attendance marked successfully",
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
