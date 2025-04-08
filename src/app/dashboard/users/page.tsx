"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
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
import { Button } from "@/components/ui/button";
import { UserPlus, Pencil, Trash } from "lucide-react";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Example user data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    createdAt: "2023-04-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Admin",
    createdAt: "2023-04-05",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Admin",
    createdAt: "2023-04-10",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Admin",
    createdAt: "2023-04-15",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    setAddDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const updateUser = (
    id: string,
    userData: { name: string; email: string }
  ) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...userData } : user
    );

    setUsers(updatedUsers);
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddUser={addUser}
      />

      <EditUserDialog
        user={currentUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateUser={updateUser}
      />
    </DashboardLayout>
  );
}
