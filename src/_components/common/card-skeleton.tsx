import { Skeleton } from "@/_components/ui/skeleton";

interface CardSkeletonProps {
  count?: number;
  showHeader?: boolean;
  showActions?: boolean;
}

export function CardSkeleton({
  count = 3,
  showHeader = true,
  showActions = true,
}: CardSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
          {showHeader && (
            <div className="mb-4 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {showActions && (
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
