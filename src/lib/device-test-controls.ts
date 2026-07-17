import "server-only";

/**
 * Temporary device-testing controls are available to local development, or to
 * one explicitly allow-listed Supabase user in a deployed environment.
 */
export function canUseDeviceTestControls(userId: string) {
  if (process.env.NODE_ENV === "development") return true;

  const allowedUserId = process.env.DEVICE_TEST_USER_ID?.trim();
  return Boolean(allowedUserId && allowedUserId === userId);
}
