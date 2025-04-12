import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { use } from "react";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// GET - Get a single attendance record
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const attendance = await prisma.attendance.findUnique({
      where: { id },
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

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error(`Error fetching attendance record:`, error);
    return NextResponse.json(
      { error: "Failed to fetch attendance record" },
      { status: 500 }
    );
  }
}

// PUT - Update an attendance record
export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const attendance = await prisma.attendance.update({
      where: { id },
      data: body,
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

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error(`Error updating attendance record:`, error);
    return NextResponse.json(
      { error: "Failed to update attendance record" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an attendance record
export async function DELETE(request: Request, { params }: RouteProps) {
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
