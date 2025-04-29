export function deriveNextStep(status: string | null): string {
  switch (status) {
    case "pending":
      return "Submit Task or Book Interview";
    case "task-submitted":
      return "Book Interview";
    case "interview-booked":
      return "Wait for Decision";
    case "accepted":
      return "Proceed to Payment";
    case "rejected":
      return "Application Rejected";
    case "payment-done":
      return "Admission Complete";
    default:
      return "Unknown";
  }
}
