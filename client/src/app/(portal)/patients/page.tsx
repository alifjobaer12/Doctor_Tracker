"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { Patient, PatientQueryParams } from "@/types/patient";
import { usePatients, usePatientFilters, useDeletePatient } from "@/hooks/usePatients";
import { useDoctors } from "@/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";

export default function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const condition = searchParams.get("condition") || undefined;
  const status = (searchParams.get("status") as PatientQueryParams["status"]) || undefined;
  const gender = (searchParams.get("gender") as PatientQueryParams["gender"]) || undefined;
  const doctor = searchParams.get("doctor") || undefined;
  const sortBy = (searchParams.get("sortBy") as PatientQueryParams["sortBy"]) || "admittedAt";
  const order = (searchParams.get("order") as PatientQueryParams["order"]) || "desc";

  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = React.useState<Patient | null>(null);

  const queryParams: PatientQueryParams = React.useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      condition,
      status,
      gender,
      doctor,
      sortBy,
      order,
    }),
    [page, limit, search, condition, status, gender, doctor, sortBy, order]
  );

  const { data, isLoading } = usePatients(queryParams);
  const { data: filters } = usePatientFilters();
  const { data: doctorsData } = useDoctors({ limit: 50 });
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const updateUrlParams = (updates: Partial<PatientQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/patients?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/patients");
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete._id, {
        onSuccess: () => {
          setPatientToDelete(null);
        },
      });
    }
  };

  const patients = data?.data || [];
  const meta = data?.meta;
  const doctorsList = doctorsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients Directory</h1>
          <p className="text-sm text-muted-foreground">
            Complete database of active, recovered, and critical patient admissions.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Toolbar & Filters */}
      <div className="glass-panel p-4 shadow-lg space-y-3">
        <SearchInput
          value={search}
          onChange={(val) => updateUrlParams({ search: val, page: 1 })}
          placeholder="Search by patient name, phone, or email..."
          className="w-full md:max-w-md bg-card/60 dark:bg-card/40 border-border/70"
        />

        <PatientFilters
          filters={filters}
          doctorsList={doctorsList}
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
      ) : patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={
            search || condition || status || gender || doctor
              ? "No patient records match the selected filters. Try clearing your search parameters."
              : "No patient records exist in the database yet."
          }
          actionLabel={
            search || condition || status || gender || doctor ? "Clear Filters" : "Register First Patient"
          }
          onAction={
            search || condition || status || gender || doctor ? handleClearFilters : handleAdd
          }
        />
      ) : (
        <PatientsTable
          patients={patients}
          onEdit={handleEdit}
          onDelete={(p) => setPatientToDelete(p)}
        />
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

      {/* Add / Edit Form Dialog */}
      <PatientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        patient={selectedPatient}
        doctorsList={doctorsList}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        title="Delete Patient Record"
        description={`Are you sure you want to delete patient "${patientToDelete?.name}"? This action will permanently remove the record and decrement the assigned doctor's patient count.`}
        confirmLabel="Delete Patient"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
