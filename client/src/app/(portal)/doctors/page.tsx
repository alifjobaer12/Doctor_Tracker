"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, LayoutGrid, List, Stethoscope } from "lucide-react";
import { Doctor, DoctorQueryParams } from "@/types/doctor";
import { useDoctors, useDoctorFilters } from "@/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { DoctorFilters } from "@/components/doctors/DoctorFilters";
import { DoctorsTable } from "@/components/doctors/DoctorsTable";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DoctorFormDialog } from "@/components/doctors/DoctorFormDialog";
import { DeleteDoctorDialog } from "@/components/doctors/DeleteDoctorDialog";

export default function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync state with URL search params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const specialization = searchParams.get("specialization") || undefined;
  const hospital = searchParams.get("hospital") || undefined;
  const sortBy = (searchParams.get("sortBy") as DoctorQueryParams["sortBy"]) || "createdAt";
  const order = (searchParams.get("order") as DoctorQueryParams["order"]) || "desc";

  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = React.useState<Doctor | null>(null);

  const queryParams: DoctorQueryParams = React.useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      specialization,
      hospital,
      sortBy,
      order,
    }),
    [page, limit, search, specialization, hospital, sortBy, order]
  );

  const { data, isLoading } = useDoctors(queryParams);
  const { data: filters } = useDoctorFilters();

  const updateUrlParams = (updates: Partial<DoctorQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/doctors?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/doctors");
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedDoctor(null);
    setFormOpen(true);
  };

  const doctors = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors Directory</h1>
          <p className="text-sm text-muted-foreground">
            Manage certified physicians, clinical specializations, and patient loads.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(val) => updateUrlParams({ search: val, page: 1 })}
            placeholder="Search by doctor name, email, or phone..."
            className="w-full md:max-w-md"
          />

          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center rounded-md border p-1 bg-muted/40">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="h-7 w-7"
                title="Table View"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-7 w-7"
                title="Card Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DoctorFilters
          filters={filters}
          queryParams={queryParams}
          onFilterChange={updateUrlParams}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors found"
          description={
            search || specialization || hospital
              ? "No doctors matched your active search or filter criteria. Try resetting filters."
              : "No doctors have been registered in the system yet."
          }
          actionLabel={search || specialization || hospital ? "Clear Filters" : "Add First Doctor"}
          onAction={search || specialization || hospital ? handleClearFilters : handleAdd}
        />
      ) : viewMode === "table" ? (
        <DoctorsTable
          doctors={doctors}
          onEdit={handleEdit}
          onDelete={(doc) => setDoctorToDelete(doc)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onEdit={handleEdit}
              onDelete={(doc) => setDoctorToDelete(doc)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalRecords={meta.total}
          pageSize={meta.limit}
          onPageChange={(p) => updateUrlParams({ page: p })}
          onPageSizeChange={(sz) => updateUrlParams({ limit: sz, page: 1 })}
        />
      )}

      {/* Form Dialog */}
      <DoctorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={selectedDoctor}
      />

      {/* Delete Dialog */}
      <DeleteDoctorDialog
        doctor={doctorToDelete}
        open={Boolean(doctorToDelete)}
        onOpenChange={(open) => !open && setDoctorToDelete(null)}
      />
    </div>
  );
}
