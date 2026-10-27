import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorsSkeletonProps {
  viewMode?: "table" | "grid";
}

export function DoctorsSkeleton({ viewMode = "table" }: DoctorsSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-5 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <Skeleton className="h-7 w-20 rounded-md" />
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden glass-panel">
      {/* Table Header Skeleton */}
      <div className="p-3.5 bg-muted/40 dark:bg-muted/25 border-b border-border/60 flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-28 hidden sm:block" />
        <Skeleton className="h-4 w-28 hidden md:block" />
        <Skeleton className="h-4 w-28 hidden lg:block" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-border/40">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-[260px]">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 hidden sm:block rounded-full" />
            <Skeleton className="h-4 w-32 hidden md:block" />
            <Skeleton className="h-4 w-28 hidden lg:block" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
