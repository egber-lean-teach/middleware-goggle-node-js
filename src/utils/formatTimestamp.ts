/**
 * Format datetime as ISO string for API calls.
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}
