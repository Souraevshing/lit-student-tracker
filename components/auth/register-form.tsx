"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { registerSchema } from "@/lib/utils/auth/register.schema";

type RegisterFormType = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Registration failed");
          }

          await signOut({ redirect: false });
          router.push("/login");
        })()
      );
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      console.error(err);
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
          autoComplete="new-password"
          {...register("password")}
          className={errors.password ? "ring-2 ring-red-500" : ""}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <Input
          type="text"
          placeholder="Name"
          {...register("name")}
          className={errors.name ? "ring-2 ring-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <Input
          type="number"
          placeholder="Age"
          {...register("age", { valueAsNumber: true })}
          className={errors.age ? "ring-2 ring-red-500" : ""}
        />
        {errors.age && (
          <p className="text-red-500 text-xs">{errors.age.message}</p>
        )}

        <Input
          type="text"
          placeholder="Gender"
          {...register("gender")}
          className={errors.gender ? "ring-2 ring-red-500" : ""}
        />
        {errors.gender && (
          <p className="text-red-500 text-xs">{errors.gender.message}</p>
        )}

        <Input
          type="text"
          placeholder="Qualification"
          {...register("qualification")}
          className={errors.qualification ? "ring-2 ring-red-500" : ""}
        />
        {errors.qualification && (
          <p className="text-red-500 text-xs">{errors.qualification.message}</p>
        )}

        <Input
          type="text"
          placeholder="Course"
          {...register("courseChoice")}
          className={errors.courseChoice ? "ring-2 ring-red-500" : ""}
        />
        {errors.courseChoice && (
          <p className="text-red-500 text-xs">{errors.courseChoice.message}</p>
        )}

        <Button
          disabled={isSubmitting || !isValid}
          type="submit"
          className="w-full flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
            </>
          ) : (
            <>
              <LogInIcon className="w-4 h-4" />
              Sign Up
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          variant="link"
          className="text-sm p-0 h-auto cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Log In
        </Button>
      </p>

      <SocialLogin />
    </div>
  );
}
