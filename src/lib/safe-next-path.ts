/** Restricts post-auth navigation to a local path on this site. */
export function safeNextPath(
  value: string | null | undefined,
  fallback = "/account",
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return fallback;
  }

  return value;
}
