"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Employee {
  id: string;
  name: string;
  email: string;
  fingerId: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  status: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [addAttendanceOpen, setAddAttendanceOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be fetched from an API
    setEmployees([
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        fingerId: "F001",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        fingerId: "F002",
      },
    ]);

    setAttendances([
      {
        id: "1",
        employeeId: "1",
        employeeName: "John Doe",
        date: new Date(),
        status: "present",
      },
      {
        id: "2",
        employeeId: "2",
        employeeName: "Jane Smith",
        date: new Date(),
        status: "late",
      },
    ]);
  }, []);

  const handleAddAttendance = (attendance: {
    employeeId: string;
    date: Date;
    status: string;
  }) => {
    const employee = employees.find((emp) => emp.id === attendance.employeeId);
    if (!employee) return;

    const newAttendance = {
      id: (attendances.length + 1).toString(),
      employeeId: attendance.employeeId,
      employeeName: employee.name,
      date: attendance.date,
      status: attendance.status,
    };
    setAttendances([...attendances, newAttendance]);
  };

  const handleDeleteAttendance = (id: string) => {
    setAttendances(attendances.filter((att) => att.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500">Late</Badge>;
      case "half-day":
        return <Badge className="bg-blue-500">Half Day</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter and sort attendances
  const filteredAttendances = attendances
    .filter((attendance) => {
      // Apply search filter
      if (
        searchTerm &&
        !attendance.employeeName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "all" && attendance.status !== statusFilter) {
        return false;
      }

      // Apply employee filter
      if (
        employeeFilter !== "all" &&
        attendance.employeeId !== employeeFilter
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.employeeName.localeCompare(b.employeeName)
          : b.employeeName.localeCompare(a.employeeName);
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Attendance Management System</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Manage employee attendance</CardDescription>
          </div>
          <Button onClick={() => setAddAttendanceOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Add Attendance
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "date" | "name" | "status")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Employee Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length > 0 ? (
                filteredAttendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{attendance.employeeName}</TableCell>
                    <TableCell>{format(attendance.date, "PPP")}</TableCell>
                    <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAttendance(attendance.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addAttendanceOpen} onOpenChange={setAddAttendanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for an employee
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddAttendance({
                employeeId: formData.get("employeeId") as string,
                date: new Date(formData.get("date") as string),
                status: formData.get("status") as string,
              });
              setAddAttendanceOpen(false);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeId">Employee</Label>
                <Select name="employeeId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Attendance</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
