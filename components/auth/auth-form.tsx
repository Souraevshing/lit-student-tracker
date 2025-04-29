"use client";

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthForm({ type }: { type: "login" | "register" }) {
  return type === "login" ? <LoginForm /> : <RegisterForm />;
}
