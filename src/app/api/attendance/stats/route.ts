import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get attendance statistics
export async function GET() {
  try {
    // Get all employees
    const totalEmployees = await prisma.employee.count();

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
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
    });

    // Get this week's attendance
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const thisWeekAttendance = await prisma.attendance.groupBy({
      by: ["employeeId"],
      where: {
        createdAt: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get this month's attendance
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

    const thisMonthAttendance = await prisma.attendance.groupBy({
      by: ["employeeId"],
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get attendance counts by day for current month (for chart)
    const dailyAttendance = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date, 
        COUNT(DISTINCT employee_id) as count
      FROM 
        "Attendance"
      WHERE 
        created_at >= ${startOfMonth} AND created_at <= ${endOfMonth}
      GROUP BY 
        DATE(created_at)
      ORDER BY 
        date
    `;

    return NextResponse.json(
      {
        totalEmployees,
        todayStats: {
          present: todayAttendance.length,
          absent: totalEmployees - todayAttendance.length,
          attendance: todayAttendance,
        },
        weeklyStats: {
          employeesWithAttendance: thisWeekAttendance.length,
          totalEntries: thisWeekAttendance.reduce(
            (sum, entry) => sum + entry._count.id,
            0
          ),
        },
        monthlyStats: {
          employeesWithAttendance: thisMonthAttendance.length,
          totalEntries: thisMonthAttendance.reduce(
            (sum, entry) => sum + entry._count.id,
            0
          ),
          avgAttendancePerEmployee:
            thisMonthAttendance.length > 0
              ? (
                  thisMonthAttendance.reduce(
                    (sum, entry) => sum + entry._count.id,
                    0
                  ) / thisMonthAttendance.length
                ).toFixed(2)
              : 0,
        },
        dailyAttendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance statistics" },
      { status: 500 }
    );
  }
}
