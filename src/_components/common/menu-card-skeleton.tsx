import { Skeleton } from "@/_components/ui/skeleton";

interface MenuCardSkeletonProps {
  count?: number;
}

export function MenuCardSkeleton({ count = 7 }: MenuCardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-card space-y-3 rounded-lg border p-4 shadow-sm"
        >
          {/* Date and day of week */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Menu items */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      ))}
    </div>
  );
}
