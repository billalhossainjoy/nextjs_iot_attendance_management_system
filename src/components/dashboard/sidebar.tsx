"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
    },
  ];

  return (
    <div className={cn("flex flex-col h-screen border-r w-[240px]", className)}>
      <div className="px-3 py-4 flex items-center border-b">
        <h2 className="text-lg font-semibold">Attendance System</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-4">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === route.href && "bg-muted"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">User Name</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
