export const formatTimeForLocale = (
  timestamp: string,
  currentLocale: { code: string; timezone: string }
) => {
  return new Date(timestamp).toLocaleTimeString(currentLocale.code, {
    timeZone: currentLocale.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
