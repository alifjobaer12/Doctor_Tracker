"use client";

import * as React from "react";
import { Activity } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullscreen?: boolean;
}

export function LoadingScreen({
  message = "Loading clinical workspace...",
  subtext = "Synchronizing physicians, patient admissions, and analytics...",
  fullscreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${
        fullscreen ? "min-h-[70vh] w-full" : "w-full py-16"
      }`}
    >
      {/* Ambient background blur circles */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing ring animation */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute h-20 w-20 rounded-full bg-primary/20 animate-ping opacity-60" />
          <div className="absolute h-24 w-24 rounded-full bg-primary/10 animate-pulse" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25 border border-white/20">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
        </div>

        {/* Glassmorphic status card */}
        <div className="glass-panel px-8 py-5 rounded-2xl text-center max-w-sm border border-border/70 shadow-xl backdrop-blur-xl space-y-2">
          <h3 className="font-semibold text-base tracking-tight text-foreground">
            {message}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {subtext}
          </p>

          {/* Glowing indeterminate progress bar */}
          <div className="pt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60 dark:bg-muted/30">
              <div className="h-full w-1/3 rounded-full bg-primary animate-[shimmer_1.5s_infinite] shadow-sm shadow-primary/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
