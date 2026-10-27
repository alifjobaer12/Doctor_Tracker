"use client";

import * as React from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <aside className="hidden md:flex w-64 flex-col border-r bg-card p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-24" />
          </header>
          <main className="p-6 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return null; // Route middleware will redirect to /login
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient Glassmorphic Mesh Lighting (Fixed Background) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[130px] transition-all" />
        <div className="absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-violet-500/12 dark:bg-violet-600/18 blur-[120px] transition-all" />
        <div className="absolute -bottom-32 left-1/3 h-[480px] w-[480px] rounded-full bg-teal-500/10 dark:bg-teal-600/15 blur-[140px] transition-all" />
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar with Frosted Glass */}
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar className="fixed inset-y-0 left-0 w-64 glass-panel border-r border-border/60" />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-background/60 backdrop-blur-md transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-72 max-w-[80vw] h-full shadow-2xl glass-panel">
              <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar user={user} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
