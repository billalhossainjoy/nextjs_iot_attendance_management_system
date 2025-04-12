import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// GET - Get a single employee
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        fingerId: true,
        name: true,
        email: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error(`Error fetching employee:`, error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PUT - Update an employee
export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const employee = await prisma.employee.update({
      where: { id },
      data: body,
      select: {
        id: true,
        fingerId: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error(`Error updating employee:`, error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an employee
export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting employee:`, error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
