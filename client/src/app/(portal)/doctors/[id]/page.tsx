"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Users,
  Calendar,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import { Patient, PatientQueryParams } from "@/types/patient";
import { useDoctor } from "@/hooks/useDoctors";
import { useDoctorPatients, usePatientFilters, useDeleteDoctorPatient } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { PatientsSkeleton } from "@/components/patients/PatientsSkeleton";
import { PatientFormDialog } from "@/components/patients/PatientFormDialog";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { DoctorFormDialog } from "@/components/doctors/DoctorFormDialog";
import { DeleteDoctorDialog } from "@/components/doctors/DeleteDoctorDialog";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = params.id as string;

  const { data: doctor, isLoading: isDoctorLoading } = useDoctor(doctorId);
  const { data: filters } = usePatientFilters();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const condition = searchParams.get("condition") || undefined;
  const status = (searchParams.get("status") as PatientQueryParams["status"]) || undefined;
  const gender = (searchParams.get("gender") as PatientQueryParams["gender"]) || undefined;
  const sortBy = (searchParams.get("sortBy") as PatientQueryParams["sortBy"]) || "admittedAt";
  const order = (searchParams.get("order") as PatientQueryParams["order"]) || "desc";

  const [patientFormOpen, setPatientFormOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = React.useState<Patient | null>(null);

  const [editDoctorOpen, setEditDoctorOpen] = React.useState(false);
  const [deleteDoctorOpen, setDeleteDoctorOpen] = React.useState(false);

  const { mutate: deleteDoctorPatient, isPending: isDeletingPatient } = useDeleteDoctorPatient();

  const queryParams: Omit<PatientQueryParams, "doctor"> = React.useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      condition,
      status,
      gender,
      sortBy,
      order,
    }),
    [page, limit, search, condition, status, gender, sortBy, order]
  );

  const { data: patientsData, isLoading: isPatientsLoading } = useDoctorPatients(
    doctorId,
    queryParams
  );

  const updateUrlParams = (updates: Partial<PatientQueryParams>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    router.push(`/doctors/${doctorId}?${nextParams.toString()}`);
  };

  const handleClearFilters = () => {
    router.push(`/doctors/${doctorId}`);
  };

  const handleDeletePatientConfirm = () => {
    if (patientToDelete) {
      deleteDoctorPatient(
        { doctorId, patientId: patientToDelete._id },
        {
          onSuccess: () => {
            setPatientToDelete(null);
          },
        }
      );
    }
  };

  if (isDoctorLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <PatientsSkeleton />
      </div>
    );
  }

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        description="The physician clinical record you requested could not be located."
        actionLabel="Back to Doctors"
        onAction={() => router.push("/doctors")}
      />
    );
  }

  const patients = patientsData?.data || [];
  const meta = patientsData?.meta;

  return (
    <div className="space-y-6">
      {/* Back Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors Directory
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDoctorOpen(true)}
            className="h-8 text-xs gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDoctorOpen(true)}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Doctor Clinical Profile Card */}
      <div className="glass-panel p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/10 text-primary border border-primary/25 shadow-sm text-xl font-bold">
              {doctor.name
                .replace(/^Dr\.\s*/i, "")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {doctor.name}
                </h1>
                <Badge variant="secondary" className="text-xs bg-secondary/80 text-secondary-foreground border border-border/50">
                  {doctor.specialization}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {doctor.hospital}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {doctor.phone}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {doctor.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Registered {format(new Date(doctor.createdAt), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-6">
            <div className="flex flex-col items-center justify-center rounded-xl bg-card/60 backdrop-blur-md border border-border/60 px-6 py-3 min-w-[120px] shadow-sm">
              <div className="flex items-center gap-1.5 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-2xl font-bold">{doctor.patientsCount}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                Active Patients
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor's Patients Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Assigned Patients</h2>
            <p className="text-xs text-muted-foreground">
              Clinical patient records under direct supervision of {doctor.name}.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedPatient(null);
              setPatientFormOpen(true);
            }}
            className="gap-1.5 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Add Patient Under Doctor
          </Button>
        </div>

        {/* Toolbar & Filters */}
        <div className="glass-panel p-4 shadow-lg space-y-3">
          <SearchInput
            value={search}
            onChange={(val) => updateUrlParams({ search: val, page: 1 })}
            placeholder="Search patients by name, phone, or email..."
            className="w-full md:max-w-md bg-card/60 dark:bg-card/40 border-border/70"
          />

          <PatientFilters
            filters={filters}
            queryParams={queryParams}
            onFilterChange={updateUrlParams}
            onClearFilters={handleClearFilters}
            hideDoctorFilter={true}
          />
        </div>

        {/* Table Content */}
        {isPatientsLoading ? (
          <PatientsSkeleton />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients under this physician"
            description={
              search || condition || status || gender
                ? "No patient records matched the active filter criteria."
                : "This doctor currently has no patients assigned."
            }
            actionLabel={
              search || condition || status || gender ? "Clear Filters" : "Register First Patient"
            }
            onAction={
              search || condition || status || gender
                ? handleClearFilters
                : () => {
                    setSelectedPatient(null);
                    setPatientFormOpen(true);
                  }
            }
          />
        ) : (
          <PatientsTable
            patients={patients}
            hideDoctorColumn={true}
            onEdit={(p) => {
              setSelectedPatient(p);
              setPatientFormOpen(true);
            }}
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
      </div>

      {/* Patient Form Dialog */}
      <PatientFormDialog
        open={patientFormOpen}
        onOpenChange={setPatientFormOpen}
        patient={selectedPatient}
        defaultDoctorId={doctor._id}
        doctorsList={[doctor]}
      />

      {/* Delete Patient from Doctor Confirmation */}
      <ConfirmDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        title="Remove Patient"
        description={`Are you sure you want to remove patient "${patientToDelete?.name}" from ${doctor.name}'s care?`}
        confirmLabel="Remove Patient"
        isLoading={isDeletingPatient}
        onConfirm={handleDeletePatientConfirm}
      />

      {/* Edit Doctor Dialog */}
      <DoctorFormDialog
        open={editDoctorOpen}
        onOpenChange={setEditDoctorOpen}
        doctor={doctor}
      />

      {/* Delete Doctor Dialog */}
      <DeleteDoctorDialog
        open={deleteDoctorOpen}
        onOpenChange={setDeleteDoctorOpen}
        doctor={doctor}
      />
    </div>
  );
}
