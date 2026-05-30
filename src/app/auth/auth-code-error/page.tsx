import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign-in error",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">
        Sign-in couldn&apos;t complete
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        That sign-in link was invalid or has expired. Please try again.
      </p>
      <Button asChild className="mt-8">
        <Link href="/login">Back to log in</Link>
      </Button>
    </div>
  );
}
