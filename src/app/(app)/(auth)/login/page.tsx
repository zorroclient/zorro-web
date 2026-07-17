import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Zorro account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
    security?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const rawNext = params.next;
  const nextPath = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  const rawSecurity = params.security;
  const security = Array.isArray(rawSecurity) ? rawSecurity[0] : rawSecurity;
  const initialNotice =
    security === "signed-out"
      ? "All saved logins and active Zorro sessions were signed out. Reset your password before signing in again if you suspect account theft."
      : null;

  return (
    <AuthForm
      mode="login"
      nextPath={nextPath}
      initialNotice={initialNotice}
    />
  );
}
