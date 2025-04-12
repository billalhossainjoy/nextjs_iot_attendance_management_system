import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { use } from "react";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get single attendance record
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: params.id,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

// PATCH - Update attendance record
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { checkIn, checkOut, status, notes } = body;

    const attendance = await prisma.attendance.update({
      where: {
        id: params.id,
      },
      data: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status,
        notes,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an attendance record
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.attendance.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Attendance record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting attendance record:`, error);
    return NextResponse.json(
      { error: "Failed to delete attendance record" },
      { status: 500 }
    );
  }
}
