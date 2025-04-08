"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint } from "lucide-react";

interface Employee {
  id: string;
  fingerId: string;
  name: string;
  email: string;
}

interface EditEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (
    id: string,
    employeeData: {
      fingerId: string;
      name: string;
      email: string;
    }
  ) => void;
}

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  onUpdateEmployee,
}: EditEmployeeDialogProps) {
  const [fingerId, setFingerId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    fingerId: "",
    name: "",
    email: "",
  });

  // Update form when employee changes
  useEffect(() => {
    if (employee) {
      setFingerId(employee.fingerId);
      setName(employee.name);
      setEmail(employee.email);
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {
      fingerId: "",
      name: "",
      email: "",
    };

    let isValid = true;

    if (!fingerId.trim()) {
      newErrors.fingerId = "Finger ID is required";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && employee) {
      onUpdateEmployee(employee.id, {
        fingerId,
        name,
        email,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fingerId" className="text-right">
                Finger ID
              </Label>
              <div className="col-span-3 relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <Input
                  id="edit-fingerId"
                  value={fingerId}
                  onChange={(e) => setFingerId(e.target.value)}
                  placeholder="FP2005"
                  className={`pl-9 ${errors.fingerId ? "border-red-500" : ""}`}
                />
                {errors.fingerId && (
                  <p className="text-red-500 text-xs mt-1">{errors.fingerId}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
