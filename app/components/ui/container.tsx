import React from "react";

/**
 * Responsive container for page content, max-width 6xl, horizontal padding.
 */
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 w-full">{children}</div>
  );
}
