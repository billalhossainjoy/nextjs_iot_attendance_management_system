import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Mark attendance using finger ID
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fingerId, action } = body;

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

    if (action === "check-in") {
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

      // Create attendance record for check-in
      const attendance = await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          status: "present",
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
    } else if (action === "check-out") {
      if (!existingAttendance) {
        return NextResponse.json(
          { error: "No check-in record found for today" },
          { status: 404 }
        );
      }

      // Update attendance record for check-out
      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOut: new Date(),
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

      return NextResponse.json(updatedAttendance, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'check-in' or 'check-out'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing attendance:", error);
    return NextResponse.json(
      { error: "Failed to process attendance" },
      { status: 500 }
    );
  }
}
