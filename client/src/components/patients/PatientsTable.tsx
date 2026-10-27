"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Pencil, Trash2, Calendar, Stethoscope } from "lucide-react";
import { Patient, PatientStatus } from "@/types/patient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  hideDoctorColumn?: boolean;
}

export function PatientsTable({
  patients,
  onEdit,
  onDelete,
  hideDoctorColumn = false,
}: PatientsTableProps) {
  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-medium">
            Active Care
          </Badge>
        );
      case "recovered":
        return (
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 text-[11px] font-medium">
            Recovered
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[11px] font-medium">
            Critical
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">Patient Name</TableHead>
            <TableHead>Demographics</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            {!hideDoctorColumn && <TableHead>Assigned Doctor</TableHead>}
            <TableHead>Admitted Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const doc = typeof patient.doctor === "object" ? patient.doctor : null;
            const docId = doc?._id || (typeof patient.doctor === "string" ? patient.doctor : "");

            return (
              <TableRow key={patient._id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground tracking-tight">
                      {patient.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{patient.phone}</span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground capitalize">
                  {patient.age} yrs • {patient.gender}
                </TableCell>

                <TableCell>
                  <span className="font-medium text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded">
                    {patient.condition}
                  </span>
                </TableCell>

                <TableCell>{getStatusBadge(patient.status)}</TableCell>

                {!hideDoctorColumn && (
                  <TableCell>
                    {doc ? (
                      <Link
                        href={`/doctors/${docId}`}
                        className="flex items-center gap-1.5 text-xs font-medium hover:underline text-primary"
                      >
                        <Stethoscope className="h-3 w-3 shrink-0" />
                        <span>{doc.name}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                )}

                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground/70" />
                    <span>
                      {patient.admittedAt
                        ? format(new Date(patient.admittedAt), "MMM d, yyyy")
                        : "N/A"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(patient)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit patient</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(patient)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete patient</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
