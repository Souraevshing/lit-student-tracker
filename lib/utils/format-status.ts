/**
 * Formats application status strings to be more readable
 * Converts snake_case or kebab-case to Title Case with spaces
 */
export function formatApplicationStatus(status: string): string {
  if (!status) return "Pending";

  const lowercaseStatus = status.toLowerCase();

  const formatted = lowercaseStatus.replace(/[_-]/g, " ");

  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
