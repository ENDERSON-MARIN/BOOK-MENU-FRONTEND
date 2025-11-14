import { Skeleton } from "@/_components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showFilters?: boolean;
  filterCount?: number;
}

export function TableSkeleton({
  columns,
  rows = 5,
  showFilters = false,
  filterCount = 3,
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col gap-4 md:flex-row">
          {[...Array(filterCount)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full md:w-[200px]" />
          ))}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(columns)].map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
