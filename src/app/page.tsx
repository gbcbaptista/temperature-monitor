"use client";

import { useState } from "react";
import TemperatureChart from "@/components/TemperatureChart";

type Locale = "US" | "BR";

export default function Home() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>("BR");

  return <TemperatureChart />;
}
