"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Mail, Phone, Users } from "lucide-react";
import { Doctor } from "@/types/doctor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DoctorsTableProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function DoctorsTable({ doctors, onEdit, onDelete }: DoctorsTableProps) {
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
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[260px]">Doctor Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-center">Assigned Patients</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 bg-primary/10 text-primary border border-primary/20">
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="font-medium hover:underline text-foreground tracking-tight"
                    >
                      {doctor.name}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">{doctor.email}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs">
                  {doctor.specialization}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {doctor.hospital}
              </TableCell>

              <TableCell>
                <div className="flex flex-col text-xs text-muted-foreground gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground/70" />
                    {doctor.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-muted-foreground/70" />
                    {doctor.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Link href={`/doctors/${doctor._id}`} title="View Doctor's Patients">
                  <Badge
                    variant={doctor.patientsCount > 0 ? "outline" : "secondary"}
                    className="cursor-pointer hover:bg-accent gap-1 text-xs px-2.5 py-0.5 transition-colors"
                  >
                    <Users className="h-3 w-3 text-primary" />
                    <span className="font-semibold">{doctor.patientsCount}</span>
                  </Badge>
                </Link>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View detail</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(doctor)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit doctor</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(doctor)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete doctor</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
