"use client";

export function DotGrid() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07] pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="hero-dots"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="2.5" fill="#7c3aed" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
    </svg>
  );
}
