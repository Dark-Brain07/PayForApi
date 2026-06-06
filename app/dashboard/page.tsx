"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  const [apis, setApis] = useState<{name: string, endpoint: string, revenue: number}[]>([
