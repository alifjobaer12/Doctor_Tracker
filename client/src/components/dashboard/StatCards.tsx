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
      iconColor: "text-blue-500 dark:text-blue-400 bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/25",
    },
    {
      title: "Total Patient Admissions",
      value: stats?.totalPatients ?? 0,
      description: "Clinical patient records",
      icon: Users,
      iconColor: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/25",
    },
    {
      title: "Average Patient Load",
      value: `${stats?.avgPatientsPerDoctor ?? 0}`,
      description: "Patients per physician",
      icon: Activity,
      iconColor: "text-violet-500 dark:text-violet-400 bg-violet-500/15 dark:bg-violet-500/20 border border-violet-500/25",
    },
    {
      title: "Monthly Intake",
      value: stats?.patientsThisMonth ?? 0,
      description: `vs. ${stats?.patientsLastMonth ?? 0} last month`,
      icon: isPositive ? TrendingUp : isNegative ? TrendingDown : Minus,
      iconColor: isPositive
        ? "text-emerald-500 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/25"
        : isNegative
        ? "text-rose-500 dark:text-rose-400 bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/25"
        : "text-muted-foreground bg-muted border border-border/50",
      trendBadge: (
        <Badge
          variant="outline"
          className={`text-[11px] font-semibold gap-1 px-2 py-0.5 h-5.5 ${
            isPositive
              ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15"
              : isNegative
              ? "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15"
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
          <Card key={idx} className="glass-card hover:translate-y-[-2px] transition-all duration-200">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-xs ${card.iconColor}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold tracking-tight text-foreground">{card.value}</div>
                {card.trendBadge}
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground font-medium">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
