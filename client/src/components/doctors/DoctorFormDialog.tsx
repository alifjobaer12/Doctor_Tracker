"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { doctorFormSchema, DoctorFormValues } from "@/schemas/doctor.schema";
import { Doctor } from "@/types/doctor";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/useDoctors";
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

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
}

export function DoctorFormDialog({ open, onOpenChange, doctor }: DoctorFormDialogProps) {
  const isEditing = Boolean(doctor);
  const { mutate: createDoctor, isPending: isCreating } = useCreateDoctor();
  const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        phone: doctor.phone,
        email: doctor.email,
      });
    } else {
      reset({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        email: "",
      });
    }
  }, [doctor, reset, open]);

  const onSubmit = (data: DoctorFormValues) => {
    if (isEditing && doctor) {
      updateDoctor(
        { id: doctor._id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createDoctor(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update physician clinical profile and contact details."
              : "Register a new doctor into the hospital network directory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Dr. Sarah Jenkins"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g. Cardiology"
                disabled={isPending}
                {...register("specialization")}
              />
              {errors.specialization && (
                <p className="text-xs text-destructive">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hospital">Hospital / Clinic</Label>
              <Input
                id="hospital"
                placeholder="e.g. Metro Health"
                disabled={isPending}
                {...register("hospital")}
              />
              {errors.hospital && (
                <p className="text-xs text-destructive">{errors.hospital.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +1 555-0123"
                disabled={isPending}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.org"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
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
              {isEditing ? "Save Changes" : "Create Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
