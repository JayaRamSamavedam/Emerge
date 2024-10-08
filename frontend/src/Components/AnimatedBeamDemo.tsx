"use client";

import React, { forwardRef, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "./utils/utils";
import { AnimatedBeam } from "./ui/AnimatedBeam";
import {
  faCross,
  faUser,
  faHandsHoldingChild,
  faHand,
  faGlobe,
  faCartShopping,
  faClipboardQuestion,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons

// Circle component for icons
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white dark:bg-gray-800 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

// Main Component
export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background dark:bg-black p-5 md:shadow-xl",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg">
        <div className="flex flex-col justify-center gap-2">
          {/* Prayer Request Icon */}
          <Circle ref={div1Ref}>
            <FontAwesomeIcon
              icon={faCross}
              className="text-lg text-black dark:text-white"
            />
          </Circle>

          {/* Outreach Queries Icon */}
          <Circle ref={div2Ref}>
            <FontAwesomeIcon
              icon={faHandsHoldingChild}
              className="text-lg text-black dark:text-white"
            />
          </Circle>

          {/* Product Queries Icon */}
          <Circle ref={div3Ref}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-lg text-black dark:text-white"
            />
          </Circle>

          {/* General Queries Icon */}
          <Circle ref={div4Ref}>
            <FontAwesomeIcon
              icon={faHand}
              className="text-lg text-black dark:text-white"
            />
          </Circle>

          {/* Other Queries Icon */}
          <Circle ref={div5Ref}>
            <FontAwesomeIcon
              icon={faClipboardQuestion}
              className="text-lg text-black dark:text-white"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-lg text-black dark:text-white"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-lg text-black dark:text-white"
            />
          </Circle>
        </div>
      </div>

      {/* Animated Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}
