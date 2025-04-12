"use client";

import { use } from "react";
import { AttendanceDetails } from "@/components/attendance/AttendanceDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AttendancePage({ params }: PageProps) {
  const { id } = use(params);

  return <AttendanceDetails id={id} />;
}
