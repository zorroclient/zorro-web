"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon, DiscordIcon } from "@/components/brand-icons";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

const REDIRECT_AFTER_AUTH = "/account";

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

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const t = copy[mode];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<null | "email" | Provider>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(REDIRECT_AFTER_AUTH)}`;

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
      setError(error.message);
      setPending(null);
    }
  }

  async function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setPending("email");
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setPending(null);
        return;
      }
      router.push(REDIRECT_AFTER_AUTH);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (error) {
        setError(error.message);
        setPending(null);
        return;
      }
      // If email confirmation is on, there's no session yet.
      if (data.session) {
        router.push(REDIRECT_AFTER_AUTH);
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

      <form onSubmit={handleEmail} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={mode === "signup" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
        </div>

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
        <Link href={t.switchHref} className="text-brand hover:underline">
          {t.switchCta}
        </Link>
      </p>
    </div>
  );
}
