"use client";

import * as React from "react";
import { FilterX, ArrowUpDown } from "lucide-react";
import { DoctorFilters as IDoctorFilters, DoctorQueryParams } from "@/types/doctor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DoctorFiltersProps {
  filters?: IDoctorFilters;
  queryParams: DoctorQueryParams;
  onFilterChange: (updates: Partial<DoctorQueryParams>) => void;
  onClearFilters: () => void;
}

export function DoctorFilters({
  filters,
  queryParams,
  onFilterChange,
  onClearFilters,
}: DoctorFiltersProps) {
  const hasActiveFilters = Boolean(
    queryParams.specialization ||
      queryParams.hospital ||
      queryParams.sortBy !== "createdAt" ||
      queryParams.order !== "desc"
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Specialization Filter */}
      <Select
        value={queryParams.specialization || "all"}
        onValueChange={(val) =>
          onFilterChange({ specialization: !val || val === "all" ? undefined : val, page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-[170px] text-xs">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Specializations
          </SelectItem>
          {filters?.specializations.map((spec) => (
            <SelectItem key={spec} value={spec} className="text-xs">
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Hospital Filter */}
      <Select
        value={queryParams.hospital || "all"}
        onValueChange={(val) =>
          onFilterChange({ hospital: !val || val === "all" ? undefined : val, page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-[170px] text-xs">
          <SelectValue placeholder="All Hospitals" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Hospitals
          </SelectItem>
          {filters?.hospitals.map((hosp) => (
            <SelectItem key={hosp} value={hosp} className="text-xs">
              {hosp}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select
        value={queryParams.sortBy || "createdAt"}
        onValueChange={(val) =>
          onFilterChange({ sortBy: (val || "createdAt") as DoctorQueryParams["sortBy"], page: 1 })
        }
      >
        <SelectTrigger className="h-9 w-[140px] text-xs">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt" className="text-xs">
            Recently Added
          </SelectItem>
          <SelectItem value="name" className="text-xs">
            Doctor Name
          </SelectItem>
          <SelectItem value="patientsCount" className="text-xs">
            Patients Count
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
