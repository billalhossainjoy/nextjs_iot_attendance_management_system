import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// GET - Get a single user
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Error fetching user:`, error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT - Update a user
export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Error updating user:`, error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting user:`, error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
