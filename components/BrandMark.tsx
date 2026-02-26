import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span className="inline-flex items-center" aria-label="Attimo Studios">
      <Image
        src="/attimo-studios-logo.svg"
        alt="Attimo Studios"
        width={160}
        height={21}
        priority
        className={cn("h-6 w-auto", className)}
      />
    </span>
  );
}

