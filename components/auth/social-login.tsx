"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SocialLogin() {
  const handleGoogleSignIn = async () => {
    try {
      toast.loading("Redirecting to Google...");
      await signIn("google", { redirectTo: "/dashboard" });
    } catch (err) {
      toast.error("Google sign-in failed");
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 hover:text-white"
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="text-lg" aria-hidden="true" />
        <span className="text-sm font-medium">Sign in with Google</span>
      </Button>
    </div>
  );
}
