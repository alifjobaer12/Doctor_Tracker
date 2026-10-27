"use client";

import * as React from "react";
import { Stethoscope, Users, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SummaryStats } from "@/types/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface StatCardsProps {
  stats?: SummaryStats;
  isLoading?: boolean;
}

export function StatCards({ stats, isLoading = false }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
          </Card>
        ))}
      </div>
    );
  }

  const changePct = stats?.monthChangePct ?? 0;
  const isPositive = changePct > 0;
  const isNegative = changePct < 0;

  const cards = [
    {
      title: "Total Physicians",
      value: stats?.totalDoctors ?? 0,
      description: "Active practicing specialists",
      icon: Stethoscope,
      iconColor: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Total Patient Admissions",
      value: stats?.totalPatients ?? 0,
      description: "Clinical patient records",
      icon: Users,
      iconColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Average Patient Load",
      value: `${stats?.avgPatientsPerDoctor ?? 0}`,
      description: "Patients per physician",
      icon: Activity,
      iconColor: "text-violet-500 bg-violet-500/10",
    },
    {
      title: "Monthly Intake",
      value: stats?.patientsThisMonth ?? 0,
      description: `vs. ${stats?.patientsLastMonth ?? 0} last month`,
      icon: isPositive ? TrendingUp : isNegative ? TrendingDown : Minus,
      iconColor: isPositive
        ? "text-emerald-500 bg-emerald-500/10"
        : isNegative
        ? "text-rose-500 bg-rose-500/10"
        : "text-muted-foreground bg-muted",
      trendBadge: (
        <Badge
          variant="outline"
          className={`text-[11px] font-semibold gap-1 px-1.5 py-0 h-5 ${
            isPositive
              ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
              : isNegative
              ? "text-rose-600 border-rose-500/30 bg-rose-500/10"
              : "text-muted-foreground"
          }`}
        >
          {isPositive ? "+" : ""}
          {changePct}%
        </Badge>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground">{card.value}</div>
                {card.trendBadge}
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
