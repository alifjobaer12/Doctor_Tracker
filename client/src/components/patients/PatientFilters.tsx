"use client";

import * as React from "react";
import { FilterX, ArrowUpDown } from "lucide-react";
import { PatientFilters as IPatientFilters, PatientQueryParams, PatientStatus, PatientGender } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PatientFiltersProps {
  filters?: IPatientFilters;
  doctorsList?: Doctor[];
  queryParams: PatientQueryParams;
  onFilterChange: (updates: Partial<PatientQueryParams>) => void;
  onClearFilters: () => void;
  hideDoctorFilter?: boolean;
}

export function PatientFilters({
  filters,
  doctorsList = [],
  queryParams,
  onFilterChange,
  onClearFilters,
  hideDoctorFilter = false,
}: PatientFiltersProps) {
  const hasActiveFilters = Boolean(
    queryParams.condition ||
      queryParams.status ||
      queryParams.gender ||
      queryParams.doctor ||
      queryParams.sortBy !== "admittedAt" ||
      queryParams.order !== "desc"
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Condition Filter */}
      <Select
        value={queryParams.condition || "all"}
        onValueChange={(val) =>
          onFilterChange({ condition: !val || val === "all" ? undefined : val, page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-[160px] text-xs">
          <SelectValue placeholder="All Conditions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Conditions
          </SelectItem>
          {filters?.conditions.map((cond) => (
            <SelectItem key={cond} value={cond} className="text-xs">
              {cond}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={queryParams.status || "all"}
        onValueChange={(val) =>
          onFilterChange({
            status: !val || val === "all" ? undefined : (val as PatientStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="h-9 w-[130px] text-xs">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Statuses
          </SelectItem>
          <SelectItem value="active" className="text-xs">
            Active Care
          </SelectItem>
          <SelectItem value="recovered" className="text-xs">
            Recovered
          </SelectItem>
          <SelectItem value="critical" className="text-xs">
            Critical
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Gender Filter */}
      <Select
        value={queryParams.gender || "all"}
        onValueChange={(val) =>
          onFilterChange({
            gender: !val || val === "all" ? undefined : (val as PatientGender),
            page: 1,
          })
        }
      >
        <SelectTrigger className="h-9 w-[120px] text-xs">
          <SelectValue placeholder="All Genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Genders
          </SelectItem>
          <SelectItem value="male" className="text-xs">
            Male
          </SelectItem>
          <SelectItem value="female" className="text-xs">
            Female
          </SelectItem>
          <SelectItem value="other" className="text-xs">
            Other
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Doctor Filter (if global patients page) */}
      {!hideDoctorFilter && doctorsList.length > 0 && (
        <Select
          value={queryParams.doctor || "all"}
          onValueChange={(val) =>
            onFilterChange({ doctor: !val || val === "all" ? undefined : val, page: 1 })
          }
        >
          <SelectTrigger className="h-9 w-[180px] text-xs">
            <SelectValue placeholder="All Doctors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Doctors
            </SelectItem>
            {doctorsList.map((doc) => (
              <SelectItem key={doc._id} value={doc._id} className="text-xs">
                {doc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort By */}
      <Select
        value={queryParams.sortBy || "admittedAt"}
        onValueChange={(val) =>
          onFilterChange({ sortBy: (val || "admittedAt") as PatientQueryParams["sortBy"], page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-[140px] text-xs">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admittedAt" className="text-xs">
            Admission Date
          </SelectItem>
          <SelectItem value="name" className="text-xs">
            Patient Name
          </SelectItem>
          <SelectItem value="age" className="text-xs">
            Patient Age
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Order Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onFilterChange({ order: queryParams.order === "asc" ? "desc" : "asc", page: 1 })
        }
        className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
        title={`Sort Order: ${queryParams.order === "asc" ? "Ascending" : "Descending"}`}
      >
        <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
        {queryParams.order === "asc" ? "Asc" : "Desc"}
      </Button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <FilterX className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
