"use client";

import { SessionProvider } from "next-auth/react";

export function NextSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
