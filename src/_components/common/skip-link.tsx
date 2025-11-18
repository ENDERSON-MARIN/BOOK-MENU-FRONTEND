"use client";

import { memo } from "react";

import { cn } from "@/_lib/utils";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink = memo(function SkipLink({
  href,
  children,
  className,
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-md focus:px-4 focus:py-2",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2",
        "focus:outline-none",
        "transition-all duration-200",
        className,
      )}
    >
      {children}
    </a>
  );
});
