import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update password",
  description: "Choose a new password for your Zorro account.",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
