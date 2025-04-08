"use client";

import { useState } from "react";
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

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: {
    fingerId: string;
    name: string;
    email: string;
  }) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onAddEmployee,
}: AddEmployeeDialogProps) {
  const [fingerId, setFingerId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    fingerId: "",
    name: "",
    email: "",
  });

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

    if (validateForm()) {
      onAddEmployee({ fingerId, name, email });
      setFingerId("");
      setName("");
      setEmail("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter employee details to add a new employee to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fingerId" className="text-right">
                Finger ID
              </Label>
              <div className="col-span-3 relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <Input
                  id="fingerId"
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
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
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
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
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
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
