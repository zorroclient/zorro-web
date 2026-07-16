import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/lib/nav";
import { createClient } from "@/lib/supabase/server";
import { AccountMenu } from "@/components/account-menu";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-20 max-w-[76rem] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <Image
              src="/brand/favicon.ico"
              alt={`${siteConfig.name} logo`}
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-md ring-1 ring-border/60"
            />
            {/* <span className="font-heading text-xl tracking-tight">
              {siteConfig.name}
            </span> */}
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <AccountMenu
                email={user.email ?? ""}
                name={
                  user.user_metadata?.full_name ?? user.user_metadata?.name
                }
                avatarUrl={user.user_metadata?.avatar_url}
              />
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Zorro</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNav items={mainNav} isLoggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
