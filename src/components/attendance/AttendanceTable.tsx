"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Attendance {
  id: string;
  employeeId: string;
  employee: {
    name: string;
    email: string;
  };
  checkIn: Date;
  checkOut: Date | null;
  status: "present" | "absent" | "late" | "half-day";
  notes?: string;
}

interface AttendanceTableProps {
  filters: {
    date: Date;
    employeeId: string;
    search: string;
  };
}

export function AttendanceTable({ filters }: AttendanceTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data] = useState<Attendance[]>([]); // TODO: Fetch data from API

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: "employee.name",
      header: "Employee",
    },
    {
      accessorKey: "employee.email",
      header: "Email",
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }) => format(new Date(row.getValue("checkIn")), "hh:mm a"),
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }) => {
        const checkOut = row.getValue("checkOut");
        return checkOut ? format(new Date(checkOut), "hh:mm a") : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = {
          present: "success",
          absent: "destructive",
          late: "warning",
          "half-day": "secondary",
        }[status] as "success" | "destructive" | "warning" | "secondary";

        return (
          <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/dashboard/attendance/${row.original.id}`)
            }
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: filters.search,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
