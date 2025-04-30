import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create a new account</h1>
          <p className="text-sm text-muted-foreground">
            Join us by filling in your details below.
          </p>
        </div>
        <AuthForm type="register" />
      </div>
    </main>
  );
}
