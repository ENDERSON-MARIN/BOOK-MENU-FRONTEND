import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
} from "@/_components/ui/page-container";
import { Skeleton } from "@/_components/ui/skeleton";

interface PageSkeletonProps {
  showHeaderAction?: boolean;
  contentType?: "table" | "cards" | "custom";
}

export function PageSkeleton({
  showHeaderAction = true,
  contentType = "table",
}: PageSkeletonProps) {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </PageHeaderContent>
        {showHeaderAction && (
          <PageHeaderActions>
            <Skeleton className="h-10 w-32" />
          </PageHeaderActions>
        )}
      </PageHeaderContainer>

      <PageContent>
        {contentType === "table" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Skeleton className="h-10 w-full md:w-[200px]" />
              <Skeleton className="h-10 w-full md:w-[200px]" />
              <Skeleton className="h-10 w-full md:w-[200px]" />
            </div>
            <Skeleton className="h-96 w-full rounded-md" />
          </div>
        )}

        {contentType === "cards" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        )}

        {contentType === "custom" && (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
