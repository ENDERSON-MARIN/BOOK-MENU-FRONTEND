import { Skeleton } from "@/_components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
  showActions?: boolean;
}

export function FormSkeleton({
  fields = 4,
  showActions = true,
}: FormSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      {showActions && (
        <div className="flex justify-end gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  );
}
