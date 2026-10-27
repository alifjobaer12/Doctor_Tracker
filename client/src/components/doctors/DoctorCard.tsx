"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Mail, Phone, Users, Building2 } from "lucide-react";
import { Doctor } from "@/types/doctor";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10 text-primary border border-primary/20">
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/doctors/${doctor._id}`}
                className="font-semibold text-sm hover:underline text-foreground tracking-tight"
              >
                {doctor.name}
              </Link>
              <div className="mt-0.5">
                <Badge variant="secondary" className="text-[11px] font-normal py-0">
                  {doctor.specialization}
                </Badge>
              </div>
            </div>
          </div>

          <Link href={`/doctors/${doctor._id}`}>
            <Badge
              variant={doctor.patientsCount > 0 ? "outline" : "secondary"}
              className="gap-1 text-xs px-2 py-0.5"
            >
              <Users className="h-3 w-3 text-primary" />
              <span>{doctor.patientsCount}</span>
            </Badge>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-xs text-muted-foreground pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{doctor.hospital}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span>{doctor.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{doctor.email}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t flex items-center justify-between">
        <Link href={`/doctors/${doctor._id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
            <Eye className="h-3.5 w-3.5" />
            View Detail
          </Button>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(doctor)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(doctor)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
