import Link from "next/link";
import { Ghost } from "lucide-react";

// Centered auth card shell + brand mark. The form components inside keep all
// their logic (validation, OAuth, Supabase); this only frames them.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="relative z-[1] w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center border border-brand/40 bg-brand/15 text-brand">
            <Ghost className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Zorro
          </span>
        </Link>
        <div className="border border-white/10 bg-white/[0.025] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
