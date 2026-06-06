"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  const [apis, setApis] = useState<{name: string, endpoint: string, revenue: number}[]>([
    { name: "My Custom Weather Model", endpoint: "api.myweather.com/v1", revenue: 42.50 },
    { name: "DeFi Sentiment Analyzer", endpoint: "defi-sense.io/analyze", revenue: 128.00 }
  ]);
