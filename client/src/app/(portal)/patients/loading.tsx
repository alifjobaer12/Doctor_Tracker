import { Skeleton } from "@/components/ui/skeleton";
import { PatientsSkeleton } from "@/components/patients/PatientsSkeleton";

export default function PatientsLoading() {
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
        <Skeleton className="h-9 w-full md:max-w-md rounded-md" />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-9 w-[170px] rounded-md" />
          <Skeleton className="h-9 w-[150px] rounded-md" />
          <Skeleton className="h-9 w-[130px] rounded-md" />
          <Skeleton className="h-9 w-[170px] rounded-md" />
          <Skeleton className="h-9 w-[140px] rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Patients Table Skeleton */}
      <PatientsSkeleton />
    </div>
  );
}
