"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface AttendanceFiltersProps {
  filters: {
    date: Date;
    employeeId: string;
    search: string;
  };
  setFilters: (filters: {
    date: Date;
    employeeId: string;
    search: string;
  }) => void;
}

export function AttendanceFilters({
  filters,
  setFilters,
}: AttendanceFiltersProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/employees");
        const data = await response.json();

        if (response.ok) {
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees:", data.error);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !filters.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date ? (
              format(filters.date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.date}
            onSelect={(date) => date && setFilters({ ...filters, date })}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select
        value={filters.employeeId}
        onValueChange={(value) => setFilters({ ...filters, employeeId: value })}
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
