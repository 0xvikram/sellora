import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The one page width and side gutter used by every section.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>{children}</div>;
}
