"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Globe, Users, Clock } from "lucide-react";
import { format, parseISO, isValid, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WeddingSettingsPrivacy } from "@/lib/wedding-defaults";

type Props = {
  initialData: WeddingSettingsPrivacy | undefined;
  onChange: (data: WeddingSettingsPrivacy) => void;
  disabled?: boolean;
};

const PASSWORD_MIN = 8;

function getPasswordStrength(password: string): { level: "weak" | "fair" | "strong"; score: number } {
  if (!password) return { level: "weak", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: "weak", score };
  if (score <= 4) return { level: "fair", score };
  return { level: "strong", score };
}

function PasswordStrengthIndicator({ strength }: { strength: ReturnType<typeof getPasswordStrength> }) {
  const segments = 3;
  const activeSegments = strength.level === "weak" ? 1 : strength.level === "fair" ? 2 : 3;
  const colors = {
    weak: "bg-destructive",
    fair: "bg-yellow-500",
    strong: "bg-green-500",
  };

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1 h-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-200",
              i < activeSegments ? colors[strength.level] : "bg-white/10"
            )}
          />
        ))}
      </div>
      <span className="text-[10px] text-tertiary-foreground capitalize">
        {strength.level}
      </span>
    </div>
  );
}

export function PrivacySection({ initialData, onChange, disabled = false }: Props) {
  const [accessType, setAccessType] = useState<"public" | "password" | "invite-only">(
    initialData?.accessType ?? "public"
  );
  const [password, setPassword] = useState(initialData?.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(
    initialData?.expiryDate
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleAccessTypeChange = (type: "public" | "password" | "invite-only") => {
    setAccessType(type);
    onChange({
      accessType: type,
      password: type === "password" ? password : undefined,
      expiryDate,
    });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    onChange({
      accessType,
      password: value,
      expiryDate,
    });
  };

  const handleExpiryDateChange = (date: string | undefined) => {
    setExpiryDate(date);
    onChange({
      accessType,
      password,
      expiryDate: date,
    });
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordError = accessType === "password" && password.length > 0 && password.length < PASSWORD_MIN;

  const inputClass =
    "min-h-[32px] w-full rounded border border-input bg-white/5 px-3 py-1.5 text-[12px] text-foreground placeholder:text-tertiary-foreground outline-none transition-all duration-150 hover:border-border/20 hover:bg-white/[0.08] focus:border-primary focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20";
  const labelClass = "block text-[11px] font-medium text-foreground mb-1";
  const descriptionClass = "text-[10px] text-tertiary-foreground mt-0.5";

  const parsedDate = expiryDate && isValid(parseISO(expiryDate)) ? parseISO(expiryDate) : undefined;
  const defaultMonth = parsedDate || addDays(new Date(), 180);

  const accessOptionClass = (type: "public" | "password" | "invite-only") =>
    cn(
      "flex-1 min-w-[140px] cursor-pointer p-4 rounded border border-border bg-white/5 transition-all duration-150",
      "hover:border-border/20 hover:bg-white/[0.08]",
      accessType === type && "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
    );

  return (
    <div className="-mx-1 -my-1 px-4 py-4 sm:px-6 sm:py-6 space-y-5">
      <div className="space-y-1">
        <h3 className="text-[13px] font-semibold text-foreground">Privacy & Access</h3>
        <p className="text-[10px] text-tertiary-foreground">
          Control who can view your wedding site and when it expires.
        </p>
      </div>

      {/* Access Type Selection */}
      <div className="rounded border border-border bg-card/50 p-4 space-y-4">
        <fieldset className="space-y-3">
          <legend className={labelClass}>Who can view your wedding site?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Public */}
            <label className={accessOptionClass("public")}>
              <input
                type="radio"
                name="accessType"
                value="public"
                checked={accessType === "public"}
                onChange={() => handleAccessTypeChange("public")}
                disabled={disabled}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={cn(
                  "inline-flex items-center justify-center size-8 rounded-full",
                  accessType === "public" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                )}>
                  <Globe className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-foreground">Public</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Anyone can view
                  </p>
                </div>
              </div>
            </label>

            {/* Password Protected */}
            <label className={accessOptionClass("password")}>
              <input
                type="radio"
                name="accessType"
                value="password"
                checked={accessType === "password"}
                onChange={() => handleAccessTypeChange("password")}
                disabled={disabled}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={cn(
                  "inline-flex items-center justify-center size-8 rounded-full",
                  accessType === "password" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                )}>
                  <Lock className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-foreground">Password</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Protected access
                  </p>
                </div>
              </div>
            </label>

            {/* Invite Only */}
            <label className={accessOptionClass("invite-only")}>
              <input
                type="radio"
                name="accessType"
                value="invite-only"
                checked={accessType === "invite-only"}
                onChange={() => handleAccessTypeChange("invite-only")}
                disabled={disabled}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={cn(
                  "inline-flex items-center justify-center size-8 rounded-full",
                  accessType === "invite-only" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                )}>
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-foreground">Invite Only</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Restricted access
                  </p>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Password Field */}
        {accessType === "password" && (
          <div className="space-y-2 pt-2 border-t border-border/20">
            <label htmlFor="privacy-password" className={labelClass}>
              Site Password
            </label>
            <div className="relative">
              <input
                id="privacy-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={disabled}
                placeholder="Enter a password"
                autoComplete="new-password"
                className={cn(
                  inputClass,
                  "pr-9",
                  passwordError && "border-destructive/50"
                )}
                aria-invalid={passwordError}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tertiary-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[10px] text-destructive flex items-center gap-1" role="alert">
                <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Password must be at least {PASSWORD_MIN} characters
              </p>
            )}
            {password && !passwordError && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}
            {password && !passwordError && passwordStrength.level === "strong" && (
              <p className="text-[10px] text-green-400 flex items-center gap-1">
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strong password
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expiry Date Card */}
      <div className="rounded border border-border bg-card/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <label htmlFor="privacy-expiry" className={labelClass}>
            Site Expiry Date (Optional)
          </label>
        </div>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="privacy-expiry"
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "min-h-[32px] w-full justify-start text-left font-normal border-input bg-white/5 text-[12px] text-foreground transition-all duration-150 hover:border-border/20 hover:bg-white/[0.08] focus:border-primary focus:bg-white/[0.08]",
                !parsedDate && "text-tertiary-foreground"
              )}
            >
              <Clock className="mr-2 size-4" />
              {parsedDate ? format(parsedDate, "PPP") : "Select expiry date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parsedDate}
              onSelect={(d) => {
                if (d) {
                  handleExpiryDateChange(format(d, "yyyy-MM-dd"));
                } else {
                  handleExpiryDateChange(undefined);
                }
                setCalendarOpen(false);
              }}
              defaultMonth={defaultMonth}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className={descriptionClass}>
          After this date, visitors will see an expired message instead of the wedding site.
        </p>
      </div>

      {/* Preview Card */}
      <div className="rounded border border-border bg-card/50 overflow-hidden">
        <div className="px-4 py-2 border-b border-border/20 bg-white/[0.02]">
          <p className="text-[10px] font-medium text-tertiary-foreground">
            Visitor Preview
          </p>
        </div>
        <div className="p-6 text-center">
          {accessType === "public" && (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-white/5">
                <Globe className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-foreground">Public Access</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Anyone with the link can view your wedding site
                </p>
              </div>
            </div>
          )}
          {accessType === "password" && (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-white/5">
                <Lock className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-foreground">Password Protected</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Visitors will be prompted to enter a password
                </p>
              </div>
              <div className="mx-auto max-w-[240px]">
                <input
                  type="password"
                  value=""
                  placeholder="Enter password"
                  disabled
                  className="w-full bg-transparent border-none text-center text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
          )}
          {accessType === "invite-only" && (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-white/5">
                <Users className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-foreground">Invite Only</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Only guests with direct links can access this private site
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
