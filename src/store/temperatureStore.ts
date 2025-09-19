import { TemperatureData } from "@/types/TemperatureData";
import { TemperatureStats } from "@/types/TemperatureStats";
import { calculateTemperatureStats } from "@/utils/calculateTemperatureStats";
import { create } from "zustand";

interface TemperatureDataState {
  stats: TemperatureStats;
  temperatureData: TemperatureData[];
  setTemperatureData: (locale: TemperatureData[]) => void;
}

export const TemperatureDataStore = create<TemperatureDataState>((set) => ({
  stats: { current: null, max: null, min: null, average: null },
  temperatureData: [],
  setTemperatureData: (data) =>
    set({ temperatureData: data, stats: calculateTemperatureStats(data) }),
}));
