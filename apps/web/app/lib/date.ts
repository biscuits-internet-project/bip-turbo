export function dateToISOStringSansTime(date: Date): string {
  return date.toISOString().split("T")[0];
}
