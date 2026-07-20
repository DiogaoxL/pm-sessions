import React from 'react';

export function SchedulingSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-hidden="true">
      {/* Date Header Skeleton */}
      <div className="h-6 w-48 bg-gray-200 rounded-md"></div>

      {/* Grid of Slots Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 w-full bg-gray-200 rounded-xl border border-gray-100"></div>
        ))}
      </div>

      {/* Form Skeleton Section */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>

        <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>

        <div className="h-10 w-32 bg-gray-200 rounded-lg mt-4"></div>
      </div>
    </div>
  );
}
