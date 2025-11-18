import { Card, CardContent, CardHeader } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

interface ReportChartSkeletonProps {
  height?: number;
}

export function ReportChartSkeleton({
  height = 300,
}: ReportChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full" style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  );
}
