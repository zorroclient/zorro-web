"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon, DiscordIcon } from "@/components/brand-icons";
import { createClient } from "@/lib/supabase/client";
import {
  validateEmail,
  validateRequiredPassword,
  validateNewPassword,
  validatePasswordConfirmation,
  friendlyAuthError,
} from "@/lib/validation";
import { safeNextPath } from "@/lib/safe-next-path";

type Mode = "login" | "signup";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to download the latest build.",
    action: "Log in",
    switchPrompt: "New here?",
    switchHref: "/signup",
    switchCta: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "One account, every client. Be in-game in minutes.",
    action: "Sign up",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchCta: "Log in",
  },
} as const;

export function AuthForm({
  mode,
  nextPath = "/account",
  initialNotice = null,
}: {
  mode: Mode;
  nextPath?: string;
  initialNotice?: string | null;
}) {
  const router = useRouter();
  const t = copy[mode];
  const redirectAfterAuth = safeNextPath(nextPath);
  const switchHref = `${t.switchHref}?next=${encodeURIComponent(redirectAfterAuth)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pending, setPending] = useState<null | "email" | Provider>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(initialNotice);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectAfterAuth)}`;
  const emailConfirmationUrl = () =>
    `${window.location.origin}/auth/confirm?next=${encodeURIComponent(redirectAfterAuth)}`;

  async function handleOAuth(provider: Provider) {
    setError(null);
    setPending(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl() },
    });
    // On success the browser is redirected to the provider, so we only land
    // here on failure.
    if (error) {
      setError(friendlyAuthError(error.message));
      setPending(null);
    }
  }

  async function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const emailErr = validateEmail(email);
    const passwordErr =
      mode === "signup"
        ? validateNewPassword(password)
        : validateRequiredPassword(password);
    const passwordConfirmationErr =
      mode === "signup"
        ? validatePasswordConfirmation(password, passwordConfirmation)
        : null;
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setPasswordConfirmationError(passwordConfirmationErr);
    if (emailErr || passwordErr || passwordConfirmationErr) return;

    setPending("email");
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(friendlyAuthError(error.message));
        setPending(null);
        return;
      }
      router.push(redirectAfterAuth);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: emailConfirmationUrl() },
      });
      if (error) {
        setError(friendlyAuthError(error.message));
        setPending(null);
        return;
      }
      // If email confirmation is on, there's no session yet.
      if (data.session) {
        router.push(redirectAfterAuth);
        router.refresh();
      } else {
        setNotice("Check your email to confirm your account, then log in.");
        setPending(null);
      }
    }
  }

  const busy = pending !== null;

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">{t.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={() => handleOAuth("google")}
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={() => handleOAuth("discord")}
        >
          <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
          Continue with Discord
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmail} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            className="rounded-none"
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            disabled={busy}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <p id="email-error" className="text-sm text-destructive" role="alert">
              {emailError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
                if (passwordConfirmationError) {
                  setPasswordConfirmationError(null);
                }
              }}
              disabled={busy}
              className="pr-10 rounded-none"
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              disabled={busy}
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
            mode === "signup" && (
              <p className="text-xs text-muted-foreground">
                At least 8 characters.
              </p>
            )
          )}
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="password-confirmation">Confirm password</Label>
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
                disabled={busy}
                className="pr-10 rounded-none"
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
                disabled={busy}
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
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="text-sm text-brand" role="status">
            {notice}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {pending === "email" ? "Working…" : t.action}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.switchPrompt}{" "}
        <Link href={switchHref} className="text-brand hover:underline">
          {t.switchCta}
        </Link>
      </p>
    </div>
  );
}
