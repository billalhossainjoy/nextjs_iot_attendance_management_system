"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { DeleteEmployeeDialog } from "@/components/DeleteEmployeeDialog";

interface Employee {
  id: string;
  name: string;
  email: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >();
  const [employeeToDelete, setEmployeeToDelete] = useState<
    Employee | undefined
  >();

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setIsEmployeeDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEmployee = (employeeData: Employee) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees(
        employees.map((employee) =>
          employee.id === selectedEmployee.id
            ? {
                ...employee,
                name: employeeData.name,
                email: employeeData.email,
              }
            : employee
        )
      );
    } else {
      // Check if ID already exists
      if (employees.some((emp) => emp.id === employeeData.id)) {
        alert(
          "An employee with this ID already exists. Please use a different ID."
        );
        return;
      }

      // Add new employee with user-provided ID
      setEmployees([...employees, employeeData]);
    }
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(
        employees.filter((employee) => employee.id !== employeeToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(undefined);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            Manage your employees and their information
          </p>
        </div>
        <Button onClick={handleAddEmployee} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">ID</TableHead>
                <TableHead className="w-[35%]">Name</TableHead>
                <TableHead className="w-[35%]">Email</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono text-sm">
                      {employee.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEmployee(employee)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEmployee(employee)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EmployeeDialog
        open={isEmployeeDialogOpen}
        onOpenChange={setIsEmployeeDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      <DeleteEmployeeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        employeeName={employeeToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
