import { Skeleton } from "@/components/ui/skeleton";
import { PatientsSkeleton } from "@/components/patients/PatientsSkeleton";

export default function DoctorDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button & Action buttons skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* Doctor Clinical Profile Card Skeleton */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-6">
            <div className="flex flex-col items-center justify-center rounded-xl bg-card/60 border border-border/60 px-6 py-3 min-w-[120px] space-y-1.5">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Patients Section Skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-72" />
          </div>
          <Skeleton className="h-8 w-44 rounded-md" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="glass-panel p-4 shadow-lg space-y-3">
          <Skeleton className="h-9 w-full md:max-w-md rounded-md" />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Skeleton className="h-9 w-[170px] rounded-md" />
            <Skeleton className="h-9 w-[150px] rounded-md" />
            <Skeleton className="h-9 w-[130px] rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Table Skeleton */}
        <PatientsSkeleton />
      </div>
    </div>
  );
}
