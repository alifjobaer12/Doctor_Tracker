import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientsSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden glass-panel">
      {/* Table Header Skeleton */}
      <div className="p-3.5 bg-muted/40 dark:bg-muted/25 border-b border-border/60 flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-20 hidden sm:block" />
        <Skeleton className="h-4 w-28 hidden md:block" />
        <Skeleton className="h-4 w-24 hidden lg:block" />
        <Skeleton className="h-4 w-32 hidden xl:block" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-border/40">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="p-3.5 flex items-center justify-between gap-4">
            <div className="space-y-1.5 w-[220px]">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton className="h-5 w-24 hidden md:block rounded-full" />
            <Skeleton className="h-5 w-20 hidden lg:block rounded-full" />
            <Skeleton className="h-4 w-28 hidden xl:block" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
