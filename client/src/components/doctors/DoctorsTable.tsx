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
    <div className="rounded-xl overflow-hidden glass-panel">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 dark:bg-muted/25 border-b border-border/60">
            <TableHead className="w-[260px] text-foreground font-semibold">Doctor Name</TableHead>
            <TableHead className="text-foreground font-semibold">Specialization</TableHead>
            <TableHead className="text-foreground font-semibold">Hospital</TableHead>
            <TableHead className="text-foreground font-semibold">Contact</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Assigned Patients</TableHead>
            <TableHead className="text-right text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id} className="hover:bg-accent/40 dark:hover:bg-accent/20 border-b border-border/40 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 bg-primary/15 text-primary border border-primary/25 shadow-xs">
                    <AvatarFallback className="text-xs font-bold">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="font-semibold hover:underline text-foreground hover:text-primary transition-colors tracking-tight text-sm"
                    >
                      {doctor.name}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">{doctor.email}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs bg-secondary/80 border border-border/50">
                  {doctor.specialization}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-muted-foreground font-medium">
                {doctor.hospital}
              </TableCell>

              <TableCell>
                <div className="flex flex-col text-xs text-muted-foreground gap-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="h-3 w-3 text-primary/70 shrink-0" />
                    {doctor.phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Mail className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    {doctor.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Link href={`/doctors/${doctor._id}`} title="View Doctor's Patients">
                  <Badge
                    variant={doctor.patientsCount > 0 ? "outline" : "secondary"}
                    className="cursor-pointer hover:bg-accent gap-1 text-xs px-2.5 py-0.5 transition-colors border-primary/30 text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    <Users className="h-3 w-3 text-primary" />
                    <span className="font-bold">{doctor.patientsCount}</span>
                  </Badge>
                </Link>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View detail</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(doctor)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit doctor</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(doctor)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
