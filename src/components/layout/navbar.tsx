"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/layout/global-search";

export function Navbar() {
  const { user, signOut } = useAuth();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/logo-icon.png"
            alt="JazzyVault"
            width={32}
            height={32}
          />
          <span className="hidden text-lg font-bold sm:inline">
            Jazzy<span className="brand-gradient-text">Vault</span>
          </span>
        </Link>

        <div className="flex flex-1 justify-center sm:justify-start">
          <GlobalSearch />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-2 text-sm text-brand-textSecondary md:flex">
            <UserIcon className="h-4 w-4" />
            <span>{displayName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
