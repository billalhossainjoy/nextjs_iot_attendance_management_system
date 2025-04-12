"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Attendance {
  id: string;
  employeeId: string;
  employee: {
    name: string;
    email: string;
  };
  checkIn: Date;
  checkOut: Date | null;
  status: "present" | "absent" | "late" | "half-day";
  notes?: string;
}

export default function AttendanceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // TODO: Fetch attendance details from API
  const attendance: Attendance = {
    id: params.id,
    employeeId: "1",
    employee: {
      name: "John Doe",
      email: "john@example.com",
    },
    checkIn: new Date(),
    checkOut: new Date(),
    status: "present",
    notes: "Regular attendance",
  };

  const statusVariant = {
    present: "success",
    absent: "destructive",
    late: "warning",
    "half-day": "secondary",
  }[attendance.status] as "success" | "destructive" | "warning" | "secondary";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/attendance")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Attendance Details</h1>
          <p className="text-muted-foreground">
            View detailed attendance information
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{attendance.employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{attendance.employee.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Attendance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={statusVariant}>
                {attendance.status.charAt(0).toUpperCase() +
                  attendance.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check In</p>
              <p className="font-medium">
                {format(new Date(attendance.checkIn), "PPP p")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check Out</p>
              <p className="font-medium">
                {attendance.checkOut
                  ? format(new Date(attendance.checkOut), "PPP p")
                  : "-"}
              </p>
            </div>
            {attendance.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{attendance.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
