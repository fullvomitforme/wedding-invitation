import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-white/[0.06]", className)}
      {...props}
    />
  );
}

export function TableSkeletonRow() {
  return (
    <tr className="h-[40px] border-b border-white/[0.04]">
      <td className="px-3 align-middle">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-3 align-middle">
        <Skeleton className="h-3 w-24" />
      </td>
      <td className="px-3 align-middle">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-3 align-middle">
        <Skeleton className="h-3 w-20" />
      </td>
      <td className="px-3 align-middle">
        <Skeleton className="ml-auto h-3 w-12" />
      </td>
    </tr>
  );
}
