import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/brand/logo.png"
              alt={`${siteConfig.name} logo`}
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-md ring-1 ring-border/60"
            />
            <span className="font-heading text-lg tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get Zorro</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
