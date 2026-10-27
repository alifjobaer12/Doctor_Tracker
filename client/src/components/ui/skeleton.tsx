import * as React from "react";
import { cn } from "cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer animate-pulse rounded-lg bg-muted/70 dark:bg-muted/40 border border-border/30",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
