import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/_components/ui/button";
import { cn } from "@/_lib/utils";

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  asChild?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      isLoading = false,
      loadingText,
      disabled,
      className,
      variant,
      size,
      asChild,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(className)}
        variant={variant}
        size={size}
        asChild={asChild}
        {...props}
      >
        {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading && loadingText ? loadingText : children}
      </Button>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
