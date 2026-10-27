import { Skeleton } from "@/components/ui/skeleton";
import { DoctorsSkeleton } from "@/components/doctors/DoctorsSkeleton";

export default function DoctorsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="glass-panel p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <Skeleton className="h-9 w-full md:max-w-md rounded-md" />
          <Skeleton className="h-9 w-20 self-end md:self-auto rounded-lg" />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-9 w-[170px] rounded-md" />
          <Skeleton className="h-9 w-[170px] rounded-md" />
          <Skeleton className="h-9 w-[140px] rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <DoctorsSkeleton viewMode="table" />
    </div>
  );
}
