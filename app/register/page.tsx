import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-semibold mb-6">Create a new account</h1>
      <AuthForm type="register" />
    </div>
  );
}
