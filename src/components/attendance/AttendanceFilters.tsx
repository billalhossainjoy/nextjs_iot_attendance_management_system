"use client";

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
          {/* TODO: Add employee options from API */}
        </SelectContent>
      </Select>
    </div>
  );
}
