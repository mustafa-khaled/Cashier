export const APP_TIME_ZONE = "Africa/Cairo";

export function formatDate(
  value: Date | string | number,
  timeZone: string = APP_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    dateStyle: "medium",
    timeZone,
  }).format(new Date(value));
}

export function formatDateTime(
  value: Date | string | number,
  timeZone: string = APP_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}
