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
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
            Active Care
          </Badge>
        );
      case "recovered":
        return (
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-[11px] font-semibold">
            Recovered
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
            Critical
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl overflow-hidden glass-panel">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 dark:bg-muted/25 border-b border-border/60">
            <TableHead className="w-[200px] text-foreground font-semibold">Patient Name</TableHead>
            <TableHead className="text-foreground font-semibold">Demographics</TableHead>
            <TableHead className="text-foreground font-semibold">Condition</TableHead>
            <TableHead className="text-foreground font-semibold">Status</TableHead>
            {!hideDoctorColumn && <TableHead className="text-foreground font-semibold">Assigned Doctor</TableHead>}
            <TableHead className="text-foreground font-semibold">Admitted Date</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const doc = typeof patient.doctor === "object" ? patient.doctor : null;
            const docId = doc?._id || (typeof patient.doctor === "string" ? patient.doctor : "");

            return (
              <TableRow key={patient._id} className="hover:bg-accent/40 dark:hover:bg-accent/20 border-b border-border/40 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground tracking-tight text-sm">
                      {patient.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{patient.phone}</span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground capitalize font-medium">
                  {patient.age} yrs • {patient.gender}
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-xs text-foreground bg-secondary/80 border border-border/50 px-2.5 py-1 rounded-md">
                    {patient.condition}
                  </span>
                </TableCell>

                <TableCell>{getStatusBadge(patient.status)}</TableCell>

                {!hideDoctorColumn && (
                  <TableCell>
                    {doc ? (
                      <Link
                        href={`/doctors/${docId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline hover:opacity-90 transition-all"
                      >
                        <Stethoscope className="h-3 w-3 shrink-0" />
                        <span>{doc.name}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                )}

                <TableCell className="text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-primary/70 shrink-0" />
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
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit patient</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(patient)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
