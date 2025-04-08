"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Fingerprint } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Employee {
  id: string;
  name: string;
  email: string;
  fingerId: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      fingerId: "F001",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      fingerId: "F002",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      fingerId: "F003",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      fingerId: "F004",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      fingerId: "F005",
    },
    {
      id: "6",
      name: "Diana Miller",
      email: "diana.miller@example.com",
      fingerId: "F006",
    },
    {
      id: "7",
      name: "Edward Davis",
      email: "edward.davis@example.com",
      fingerId: "F007",
    },
    {
      id: "8",
      name: "Fiona Clark",
      email: "fiona.clark@example.com",
      fingerId: "F008",
    },
    {
      id: "9",
      name: "George Wilson",
      email: "george.wilson@example.com",
      fingerId: "F009",
    },
    {
      id: "10",
      name: "Hannah Lee",
      email: "hannah.lee@example.com",
      fingerId: "F010",
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: Math.random().toString(36).substring(2, 9),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees(
      employees.map((emp) => (emp.id === employee.id ? employee : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${employee.email}`} />
              <AvatarFallback>
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{employee.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "fingerId",
      header: "Finger ID",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.fingerId}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(employee)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(employee.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your employees and their information
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <DataTable columns={columns} data={employees} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to the system
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addEmployee({
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                fingerId: formData.get("fingerId") as string,
              });
              setIsAddDialogOpen(false);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fingerId">Finger ID</Label>
                <Input id="fingerId" name="fingerId" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {currentEmployee && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Update employee information</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateEmployee({
                  id: currentEmployee.id,
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  fingerId: formData.get("fingerId") as string,
                });
                setIsEditDialogOpen(false);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={currentEmployee.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={currentEmployee.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fingerId">Finger ID</Label>
                  <Input
                    id="fingerId"
                    name="fingerId"
                    defaultValue={currentEmployee.fingerId}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
