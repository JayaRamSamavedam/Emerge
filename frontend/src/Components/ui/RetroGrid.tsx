import React from "react";
import { cn } from "../utils/utils";

export function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-50 [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",

            // Grid sizing and placement
            "[background-repeat:repeat] [background-size:60px_60px] h-[300vh] inset-0 [margin-left:-50%] [transform-origin:100%_0_0] w-[600vw]",

            // Thick Black Lines for Light Mode
            "[background-image:linear-gradient(to_right,black_2px,transparent_0),linear-gradient(to_bottom,black_2px,transparent_0)]",

            // No lines in Dark Mode
            "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]",
          )}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
}
