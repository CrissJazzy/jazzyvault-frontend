import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-gradient-radial flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/images/logo-icon.png"
        alt="JazzyVault"
        width={120}
        height={120}
        priority
        className="mb-6"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-3">
        Jazzy<span className="brand-gradient-text">Vault</span>
      </h1>
      <p className="text-brand-textSecondary text-lg max-w-md">
        Convert. Store. Secure. Smarter.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/register">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Log in
          </Button>
        </Link>
      </div>

      <p className="text-brand-textSecondary/60 text-sm mt-8">
        Phase 2 — Authentication System ✓
      </p>
    </main>
  );
}
