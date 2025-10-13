import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const GameCardSkeleton = memo(() => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-5 w-3/4" />

      {/* Stats skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
});

GameCardSkeleton.displayName = "GameCardSkeleton";

export default GameCardSkeleton;
