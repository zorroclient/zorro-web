import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Zorro account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const rawNext = (await searchParams).next;
  const nextPath = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  return <AuthForm mode="login" nextPath={nextPath} />;
}
