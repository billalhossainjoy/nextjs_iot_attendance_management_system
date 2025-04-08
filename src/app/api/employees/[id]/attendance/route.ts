import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// GET - Get attendance records for a specific employee
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

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

    // Set up date filters
    let dateFilter = {};

    if (startDateParam) {
      const startDate = new Date(startDateParam);
      startDate.setHours(0, 0, 0, 0);

      if (endDateParam) {
        const endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);

        dateFilter = {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      } else {
        // If only startDate is provided, get attendance for just that day
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);

        dateFilter = {
          createdAt: {
            gte: startDate,
            lt: nextDay,
          },
        };
      }
    }

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: id,
        ...dateFilter,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get attendance statistics
    const totalAttendance = await prisma.attendance.count({
      where: {
        employeeId: id,
      },
    });

    // Get current month's attendance
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const currentMonthAttendance = await prisma.attendance.count({
      where: {
        employeeId: id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Calculate work days in current month (excluding weekends)
    const workDaysInMonth = (() => {
      let count = 0;
      let date = new Date(startOfMonth);

      while (date <= endOfMonth) {
        // 0 = Sunday, 6 = Saturday
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
          count++;
        }
        date.setDate(date.getDate() + 1);
      }

      return count;
    })();

    // Calculate days up to today (excluding weekends)
    const workDaysUpToToday = (() => {
      let count = 0;
      let date = new Date(startOfMonth);

      while (date <= today) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
          count++;
        }
        date.setDate(date.getDate() + 1);
      }

      return count;
    })();

    return NextResponse.json(
      {
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          fingerId: employee.fingerId,
        },
        attendanceRecords,
        stats: {
          totalAttendance,
          currentMonthAttendance,
          workDaysInMonth,
          workDaysUpToToday,
          attendanceRate:
            workDaysUpToToday > 0
              ? ((currentMonthAttendance / workDaysUpToToday) * 100).toFixed(
                  2
                ) + "%"
              : "0%",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Error fetching attendance for employee ${params.id}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}
