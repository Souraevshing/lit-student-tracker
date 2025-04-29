"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/utils/auth/login.schema";
import { LoadingSpinner } from "../ui/loading-spinner";

type LoginFormType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await toast.promise(
        (async () => {
          await signOut({ redirect: false });
          const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (res?.error) {
            toast.error(res.error);
            throw new Error(res?.error || "Login failed");
          }

          router.push("/dashboard");
        })()
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
          className={errors.email ? "ring-2 ring-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          {...register("password")}
          className={errors.password ? "ring-2 ring-red-500" : ""}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
            </>
          ) : (
            <>
              <LogInIcon className="w-4 h-4" />
              Log In
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Button
          variant="link"
          className="text-sm p-0 h-auto cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Sign Up
        </Button>
      </p>

      <SocialLogin />
    </div>
  );
}
