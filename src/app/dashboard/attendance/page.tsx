"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { Input } from "@/components/ui/input";

interface Attendance {
  id: string;
  employee: {
    name: string;
    email: string;
  };
  checkIn: string;
  checkOut: string | null;
  status: "present" | "absent" | "late" | "half-day";
  notes?: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    date: new Date(),
    employeeId: "all",
    search: "",
  });
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filters.date) {
          params.append("date", filters.date.toISOString());
        }
        if (filters.employeeId) {
          params.append("employeeId", filters.employeeId);
        }

        const response = await fetch(`/api/attendances?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch attendances");
        }
        const data = await response.json();
        setAttendances(data);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-muted-foreground">
            View and manage employee attendance records
          </p>
        </div>
      </div>

      <AttendanceStats />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <AttendanceFilters filters={filters} setFilters={setFilters} />
      </div>

      <AttendanceTable data={attendances} isLoading={isLoading} />
    </div>
  );
}
