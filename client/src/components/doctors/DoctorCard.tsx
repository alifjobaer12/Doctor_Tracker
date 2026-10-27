"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Mail, Phone, Users, Building2 } from "lucide-react";
import { Doctor } from "@/types/doctor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onEdit, onDelete }: DoctorCardProps) {
  const getInitials = (name: string) => {
    return name
      .replace(/^Dr\.\s*/i, "")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="glass-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 bg-primary/10 text-primary border border-primary/25 shadow-sm">
              <AvatarFallback className="text-xs font-bold text-primary">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/doctors/${doctor._id}`}
                className="font-semibold text-sm hover:text-primary transition-colors text-foreground tracking-tight line-clamp-1"
              >
                {doctor.name}
              </Link>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className="text-[11px] font-medium py-0 bg-secondary/80 text-secondary-foreground border border-border/50"
                >
                  {doctor.specialization}
                </Badge>
              </div>
            </div>
          </div>

          <Link href={`/doctors/${doctor._id}`}>
            <Badge
              variant="outline"
              className="gap-1 text-xs px-2.5 py-0.5 bg-card/60 border-border/70 hover:border-primary/50 text-foreground transition-colors"
            >
              <Users className="h-3 w-3 text-primary" />
              <span className="font-semibold">{doctor.patientsCount}</span>
            </Badge>
          </Link>
        </div>
      </div>

      <div className="px-5 py-2 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <span className="truncate text-foreground/85 font-medium">{doctor.hospital}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <span className="text-foreground/85">{doctor.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <span className="truncate text-foreground/85">{doctor.email}</span>
        </div>
      </div>

      <div className="mt-3 px-5 py-3 border-t border-border/50 bg-card/30 flex items-center justify-between">
        <Link href={`/doctors/${doctor._id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary">
            <Eye className="h-3.5 w-3.5" />
            View Detail
          </Button>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(doctor)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card/60"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(doctor)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
