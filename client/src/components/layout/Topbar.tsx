"use client";

import * as React from "react";
import { LogOut, Menu, User as UserIcon, Shield } from "lucide-react";
import { User } from "@/types/auth";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  user?: User;
  onOpenMobileMenu: () => void;
}

export function Topbar({ user, onOpenMobileMenu }: TopbarProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card/80 px-4 md:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileMenu}
          className="md:hidden h-9 w-9 text-muted-foreground"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold leading-none">{user.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{user.email}</span>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex capitalize text-[10px] py-0 px-1.5 h-5 ml-1">
              <Shield className="h-2.5 w-2.5 mr-1 text-primary" />
              {user.role}
            </Badge>
          </div>
        )}

        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          disabled={isPending}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
