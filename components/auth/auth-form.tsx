"use client";

import { LogInIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";

export function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    qualification: "",
    courseChoice: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "login" && (!data.email || !data.password)) {
      setError("All fields are mandatory");
      toast.error("All fields are mandatory");
      return;
    }

    if (
      type === "register" &&
      (!data.name ||
        !data.age ||
        !data.gender ||
        !data.qualification ||
        !data.courseChoice)
    ) {
      setError("All fields are mandatory");
      toast.error("All fields are mandatory");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (type === "login") {
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
          redirectTo: "/dashboard",
        });

        if (res?.error) {
          setError(res.error);
          toast.error("Invalid email or password");
          console.log(error);
        } else {
          toast.success("Login successful");
          router.push("/dashboard");
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          const msg = err.message || "Something went wrong";
          setError(msg);
          toast.error(msg);
        } else {
          toast.success("Registration successful");
          router.push("/login");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error && err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className={error ? "ring-2 ring-red-500" : ""}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className={error ? "ring-2 ring-red-500" : ""}
        />

        {type === "register" && (
          <>
            <Input
              type="text"
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className={error ? "ring-2 ring-red-500" : ""}
            />
            <Input
              type="number"
              placeholder="Age"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              className={error ? "ring-2 ring-red-500" : ""}
            />
            <Input
              type="text"
              placeholder="Gender"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className={error ? "ring-2 ring-red-500" : ""}
            />
            <Input
              type="text"
              placeholder="Qualification"
              value={data.qualification}
              onChange={(e) =>
                setData({ ...data, qualification: e.target.value })
              }
              className={error ? "ring-2 ring-red-500" : ""}
            />
            <Input
              type="text"
              placeholder="Course"
              value={data.courseChoice}
              onChange={(e) =>
                setData({ ...data, courseChoice: e.target.value })
              }
              className={error ? "ring-2 ring-red-500" : ""}
            />
          </>
        )}

        <Button
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              <LogInIcon className="w-4 h-4" />
              {type === "login" ? "Log In" : "Sign Up"}
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {type === "register" ? (
          <>
            Already have an account?{" "}
            <Button
              disabled={loading}
              variant="link"
              className="text-sm p-0 h-auto cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Button
              disabled={loading}
              variant="link"
              className="text-sm p-0 h-auto cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </Button>
          </>
        )}
      </p>

      <SocialLogin />
    </div>
  );
}
