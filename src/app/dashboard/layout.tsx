"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  UserCog,
  LogOut,
  Menu,
  CalendarClock,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when navigating to a new page on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

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

    {
      label: "Employees",
      icon: UserCog,
      href: "/dashboard/employees",
    },
    {
      label: "Attendance",
      icon: CalendarClock,
      href: "/dashboard/attendance",
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Management
            </h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback>
              {session?.user?.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "UN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {session?.user?.email || "Admin"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed right-4 top-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <ScrollArea className="h-full">
              <SidebarContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden border-r bg-muted/40 md:block md:w-60">
          <ScrollArea>
            <SidebarContent />
          </ScrollArea>
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
