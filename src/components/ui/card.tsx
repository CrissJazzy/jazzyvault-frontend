import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 md:p-8 shadow-xl shadow-black/20",
        className
      )}
    >
      {children}
    </div>
  );
}
