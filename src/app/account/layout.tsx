import { signOut } from "@/lib/auth-actions";
import { AccountNav } from "@/components/account-nav";
import { Button } from "@/components/ui/button";

// Auth is enforced in the proxy (redirects unauthenticated users to /login),
// so this shell can stay focused on layout.
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account</h1>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>
      <div className="mt-8">
        <AccountNav />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
