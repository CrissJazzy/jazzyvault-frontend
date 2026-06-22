import Image from "next/image";
import Link from "next/link";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-brand-gradient-radial flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3">
        <Image
          src="/images/logo-icon.png"
          alt="JazzyVault"
          width={64}
          height={64}
          priority
        />
        <span className="text-2xl font-bold">
          Jazzy<span className="brand-gradient-text">Vault</span>
        </span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-brand-textSecondary">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
