// This will act as a fake DB
export const mockApplicationStatuses = [
  {
    userId: "user1",
    status: "Interview Scheduled",
    timeline: [
      { step: "Applied", date: "2025-04-10" },
      { step: "Under Review", date: "2025-04-12" },
      { step: "Interview Scheduled", date: "2025-04-15" },
    ],
  },
  {
    userId: "user2",
    status: "Pending Review",
    timeline: [{ step: "Applied", date: "2025-04-11" }],
  },
];
