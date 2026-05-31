"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-actions";

type NavItem = { title: string; href: string };

type Props = {
  items: readonly NavItem[];
  isLoggedIn: boolean;
};

export function MobileNav({ items, isLoggedIn }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-2 py-2 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator className="my-2" />

        <div className="flex flex-col gap-2 px-4">
          {isLoggedIn ? (
            <>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account">Account</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account/download">Download</Link>
                </Button>
              </SheetClose>
              <form action={signOut}>
                <Button type="submit" variant="ghost" className="w-full">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Zorro</Link>
                </Button>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
