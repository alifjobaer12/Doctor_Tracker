"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Doctor } from "@/types/doctor";
import { useDeleteDoctor } from "@/hooks/useDoctors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDoctorDialogProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDoctorDialog({ doctor, open, onOpenChange }: DeleteDoctorDialogProps) {
  const [cascade, setCascade] = React.useState(false);
  const { mutate: deleteDoctor, isPending } = useDeleteDoctor();

  React.useEffect(() => {
    if (open) {
      setCascade(false);
    }
  }, [open]);

  if (!doctor) return null;

  const hasPatients = doctor.patientsCount > 0;

  const handleDelete = () => {
    deleteDoctor(
      { id: doctor._id, cascade },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 text-sm text-muted-foreground text-left">
            <span>
              Are you sure you want to delete <strong>{doctor.name}</strong> from the database?
            </span>

            {hasPatients ? (
              <span className="block p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs space-y-2">
                <span className="block font-semibold">
                  Warning: This doctor currently has {doctor.patientsCount} active patient(s) assigned.
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={cascade}
                    onChange={(e) => setCascade(e.target.checked)}
                    className="rounded border-amber-400 text-destructive focus:ring-destructive"
                  />
                  <span>Permanently delete all {doctor.patientsCount} associated patient records (Cascade)</span>
                </label>
                {!cascade && (
                  <span className="block text-[11px] text-muted-foreground">
                    Without cascade enabled, deletion will be blocked by referential integrity.
                  </span>
                )}
              </span>
            ) : (
              <span className="block text-xs">This action cannot be undone.</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Doctor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
