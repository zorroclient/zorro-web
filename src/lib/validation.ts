// Lightweight client-side validation + friendly auth-error mapping shared by
// the auth forms. Each validator returns an error string, or null when valid.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return null;
}

// For logging in: any non-empty password (length rules are the server's job).
export function validateRequiredPassword(value: string): string | null {
  if (!value) return "Enter your password.";
  return null;
}

// For sign-up / setting a new password.
export function validateNewPassword(value: string): string | null {
  if (!value) return "Choose a password.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

// Turn raw Supabase auth errors into something a user can act on.
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email or password isn't right.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirm your email first — check your inbox for the link.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Try logging in.";
  }
  if (m.includes("signups not allowed")) {
    return "Sign-ups are currently disabled. Please try again later.";
  }
  if (m.includes("should be different")) {
    return "Your new password must be different from your old one.";
  }
  if (m.includes("for security purposes") || m.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}
