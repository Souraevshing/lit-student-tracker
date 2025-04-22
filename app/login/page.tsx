"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-semibold mb-6">Login to continue</h1>
      <AuthForm type="login" />
    </div>
  );
}
