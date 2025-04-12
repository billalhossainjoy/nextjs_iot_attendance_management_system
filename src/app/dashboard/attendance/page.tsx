"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { Input } from "@/components/ui/input";

export default function AttendancePage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    date: new Date(),
    employeeId: "all",
    search: "",
  });

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

      <AttendanceTable filters={filters} />
    </div>
  );
}
