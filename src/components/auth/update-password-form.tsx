"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  validateNewPassword,
  validatePasswordConfirmation,
  friendlyAuthError,
} from "@/lib/validation";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const passwordErr = validateNewPassword(password);
    const passwordConfirmationErr = validatePasswordConfirmation(
      password,
      passwordConfirmation,
    );
    setPasswordError(passwordErr);
    setPasswordConfirmationError(passwordConfirmationErr);
    if (passwordErr || passwordConfirmationErr) return;

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(friendlyAuthError(error.message));
      setPending(false);
      return;
    }
    setDone(true);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          Recovery mode // secure
        </p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password for your Zorro account.
        </p>
      </div>

      {done ? (
        <div className="mt-8 border-l-2 border-brand bg-brand/10 p-4">
          <p className="text-sm text-brand" role="status">
            Your password has been updated.
          </p>
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href="/account">Continue to your account</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                  if (passwordConfirmationError) {
                    setPasswordConfirmationError(null);
                  }
                }}
                disabled={pending}
                className="rounded-none pr-10"
                aria-invalid={passwordError ? true : undefined}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                disabled={pending}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordError ? (
              <p
                id="password-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {passwordError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                At least 8 characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-confirmation">
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="password-confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  if (passwordConfirmationError) {
                    setPasswordConfirmationError(null);
                  }
                }}
                disabled={pending}
                className="rounded-none pr-10"
                aria-invalid={
                  passwordConfirmationError ? true : undefined
                }
                aria-describedby={
                  passwordConfirmationError
                    ? "password-confirmation-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((shown) => !shown)}
                disabled={pending}
                aria-label={
                  showPasswordConfirmation
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
                aria-pressed={showPasswordConfirmation}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordConfirmationError && (
              <p
                id="password-confirmation-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {passwordConfirmationError}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Saving…" : "Update password"}
          </Button>
        </form>
      )}
    </div>
  );
}
