"use client";

import { useFormStatus } from "react-dom";
import { resumeSubscriptionRenewal } from "@/lib/billing-actions";
import { Button } from "@/components/ui/button";

function ResumeButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Resuming…" : "Keep my subscription"}
    </Button>
  );
}

export function ResumeSubscriptionButton() {
  return (
    <form action={resumeSubscriptionRenewal}>
      <ResumeButton />
    </form>
  );
}
