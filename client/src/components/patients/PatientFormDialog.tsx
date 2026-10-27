"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { patientFormSchema, PatientFormValues } from "@/schemas/patient.schema";
import { Patient } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  defaultDoctorId?: string;
  doctorsList?: Doctor[];
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  defaultDoctorId,
  doctorsList = [],
}: PatientFormDialogProps) {
  const isEditing = Boolean(patient);
  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: 30,
      gender: "male",
      phone: "",
      email: "",
      condition: "",
      status: "active",
      notes: "",
      doctor: defaultDoctorId || "",
    },
  });

  const selectedGender = watch("gender");
  const selectedStatus = watch("status");
  const selectedDoctor = watch("doctor");

  React.useEffect(() => {
    if (patient) {
      const docId = typeof patient.doctor === "object" ? patient.doctor._id : patient.doctor;
      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || "",
        condition: patient.condition,
        status: patient.status,
        notes: patient.notes || "",
        doctor: docId,
        admittedAt: patient.admittedAt ? new Date(patient.admittedAt).toISOString().split("T")[0] : undefined,
      });
    } else {
      reset({
        name: "",
        age: 30,
        gender: "male",
        phone: "",
        email: "",
        condition: "",
        status: "active",
        notes: "",
        doctor: defaultDoctorId || "",
      });
    }
  }, [patient, defaultDoctorId, reset, open]);

  const onSubmit = (data: PatientFormValues) => {
    if (isEditing && patient) {
      updatePatient(
        { id: patient._id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createPatient(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Patient" : "Register New Patient"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update patient medical status, clinical notes, and physician assignment."
              : "Register a new patient into the hospital registry and assign a physician."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="patient-name">Patient Full Name</Label>
            <Input
              id="patient-name"
              placeholder="e.g. Jane Doe"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                disabled={isPending}
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                value={selectedGender}
                onValueChange={(val) => val && setValue("gender", val as PatientFormValues["gender"])}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="patient-phone">Phone Number</Label>
              <Input
                id="patient-phone"
                placeholder="e.g. +1 555-0182"
                disabled={isPending}
                {...register("phone")}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="patient-email">Email (Optional)</Label>
              <Input
                id="patient-email"
                type="email"
                placeholder="patient@example.com"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="condition">Medical Condition</Label>
              <Input
                id="condition"
                placeholder="e.g. Hypertension, Asthma"
                disabled={isPending}
                {...register("condition")}
              />
              {errors.condition && <p className="text-xs text-destructive">{errors.condition.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => val && setValue("status", val as PatientFormValues["status"])}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Care</SelectItem>
                  <SelectItem value="recovered">Recovered</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
            </div>
          </div>

          {/* Assigned Doctor */}
          <div className="space-y-1.5">
            <Label>Assigned Physician</Label>
            {doctorsList.length > 0 ? (
              <Select
                value={selectedDoctor}
                onValueChange={(val) => val && setValue("doctor", val, { shouldValidate: true })}
                disabled={isPending || Boolean(defaultDoctorId && !isEditing)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a physician" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsList.map((doc) => (
                    <SelectItem key={doc._id} value={doc._id}>
                      {doc.name} — {doc.specialization} ({doc.hospital})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="doctor"
                placeholder="Doctor ID"
                disabled={isPending || Boolean(defaultDoctorId)}
                {...register("doctor")}
              />
            )}
            {errors.doctor && <p className="text-xs text-destructive">{errors.doctor.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Clinical Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="e.g. History of allergies, initial observations..."
              disabled={isPending}
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Patient" : "Register Patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
