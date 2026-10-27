import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="glass-card p-6 rounded-xl lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>

        <div className="glass-card p-6 rounded-xl lg:col-span-3 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="glass-card p-6 rounded-xl lg:col-span-3 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        <div className="glass-card p-6 rounded-xl lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
