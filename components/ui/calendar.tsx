"use client";

import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const defaultClassNames = getDefaultClassNames();

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaultClassNames,
        root: "rdp-root",
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-white/5 border-white/10 text-neutral-200 absolute left-1 top-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-white/5 border-white/10 text-neutral-200 absolute right-1 top-1"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-neutral-400 rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-8 w-8 text-center text-sm p-0 relative",
        day_button: cn(
          "h-8 w-8 p-0 font-normal rounded-md text-neutral-200",
          "hover:bg-white/10 focus:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A]",
          "aria-selected:opacity-100"
        ),
        selected:
          "bg-[#BFA14A] text-[#0E0E10] hover:bg-[#BFA14A]/90 focus:bg-[#BFA14A] focus:text-[#0E0E10]",
        today: "bg-white/15 text-neutral-100",
        outside: "text-neutral-500 aria-selected:text-neutral-500",
        disabled: "text-neutral-600 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
