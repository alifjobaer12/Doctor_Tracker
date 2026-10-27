"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { loginFormSchema, LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleFillDemoAdmin = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin@12345", { shouldValidate: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Ambient glassmorphic glowing orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 dark:bg-blue-500/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/15 dark:bg-violet-500/15 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[120px]" />
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <div className="glass-pill p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Login Glass Panel */}
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-3 text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-white/20">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Tracker</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Clinical Administration & Patient Care Management
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@doctortracker.com"
                className="pl-9 bg-card/60 dark:bg-card/40 border-border/70 focus:border-primary/50 text-foreground"
                disabled={isPending}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-9 bg-card/60 dark:bg-card/40 border-border/70 focus:border-primary/50 text-foreground"
                disabled={isPending}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFillDemoAdmin}
            className="w-full text-xs font-medium text-foreground bg-card/40 hover:bg-card/70 border-dashed border-border/80 transition-colors"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500 shrink-0" />
            Quick Fill Demo Admin Credentials
          </Button>

          <Button
            type="submit"
            className="w-full font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In to Admin Portal"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border/50 text-center flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Role-Based Access Protected · JWT HttpOnly Session</span>
        </div>
      </div>
    </div>
  );
}
