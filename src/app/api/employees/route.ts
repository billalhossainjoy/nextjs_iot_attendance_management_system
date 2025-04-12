import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Retrieve all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        fingerId: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fingerId, name, email } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if employee with this email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 409 }
      );
    }

    // Create new employee
    const newEmployee = await prisma.employee.create({
      data: {
        fingerId,
        name,
        email,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
