"use client";

import * as React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-border/80 glass-panel shadow-sm ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 text-muted-foreground mb-3.5 shadow-inner">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-base tracking-tight mb-1 text-foreground">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
