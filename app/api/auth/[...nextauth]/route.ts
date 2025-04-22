import NextAuth from "next-auth";

import authOptions from "@/app/api/auth/authOptions";

const handler = NextAuth(authOptions);

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
