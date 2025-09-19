import { TemperatureData } from "@/types/TemperatureData";
import { TemperatureStats } from "@/types/TemperatureStats";

export const calculateTemperatureStats = (
  temperatureData: TemperatureData[]
): TemperatureStats => {
  if (temperatureData.length === 0) {
    return { current: null, max: null, min: null, average: null };
  }

  const temperatures = temperatureData.map((data) => data.temperature);
  const current = temperatures[temperatures.length - 1];
  const max = Math.max(...temperatures);
  const min = Math.min(...temperatures);
  const average =
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

  return { current, max, min, average };
};
