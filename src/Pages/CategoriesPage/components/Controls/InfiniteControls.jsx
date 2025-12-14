import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function InfiniteControls({
  visibleCount,
  sortedProducts,
  loading,
  loadMore,
}) {
  return (
    <div className="flex items-center gap-4 w-full justify-center">
      {visibleCount < sortedProducts.length && (
        <Button
          onClick={loadMore}
          className="bg-[#FF0055] text-white px-6 py-3 rounded-xl shadow"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading
            </span>
          ) : (
            "Load More"
          )}
        </Button>
      )}
      {visibleCount < sortedProducts.length && loading && (
        <div className="flex items-center gap-2 text-[#FF0055]">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading more...
        </div>
      )}
      {visibleCount >= sortedProducts.length && (
        <div className="text-sm text-gray-600">You've reached the end</div>
      )}
    </div>
  );
}
