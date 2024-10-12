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
} from "@fortawesome/free-solid-svg-icons";

// Circle component for icons
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 items-center justify-center rounded-full border-2 border-border bg-white dark:bg-gray-800 p-4 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )} // Adjust sizes for responsive design
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
        "relative flex h-[500px] sm:h-[600px] lg:h-[700px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background dark:bg-black p-4 sm:p-8 md:p-12 lg:p-16 md:shadow-xl", // Responsive container height and padding
        className
      )}
      ref={containerRef}
    >
      <div className="flex w-full flex-row flex-wrap lg:flex-nowrap items-stretch justify-between gap-6 sm:gap-10 lg:gap-16 max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col justify-center gap-4 sm:gap-6">
          {/* Prayer Request Icon */}
          <Circle ref={div1Ref}>
            <FontAwesomeIcon
              icon={faCross}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white" // Responsive icon size
            />
          </Circle>

          {/* Outreach Queries Icon */}
          <Circle ref={div2Ref}>
            <FontAwesomeIcon
              icon={faHandsHoldingChild}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white"
            />
          </Circle>

          {/* Product Queries Icon */}
          <Circle ref={div3Ref}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white"
            />
          </Circle>

          {/* General Queries Icon */}
          <Circle ref={div4Ref}>
            <FontAwesomeIcon
              icon={faHand}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white"
            />
          </Circle>

          {/* Other Queries Icon */}
          <Circle ref={div5Ref}>
            <FontAwesomeIcon
              icon={faClipboardQuestion}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-2xl sm:text-3xl lg:text-4xl text-black dark:text-white" // Larger central icon for bigger screens
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-xl sm:text-2xl lg:text-3xl text-black dark:text-white"
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
