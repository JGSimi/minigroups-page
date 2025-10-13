import React, { useEffect, useState } from "react";

interface HeroBackground3DProps {
  url?: string;
  className?: string;
  minBreakpoint?: "none" | "sm" | "md" | "lg";
}

interface ImportMeta {
  env: {
    VITE_SPLINE_SCENE_URL?: string;
    [key: string]: string | undefined;
  };
}

const HeroBackground3D: React.FC<HeroBackground3DProps> = ({
  url,
  className,
  minBreakpoint = "none",
}) => {
  const sceneUrl = url ?? (import.meta as ImportMeta).env.VITE_SPLINE_SCENE_URL ?? "https://prod.spline.design/PBQQBw8bfXDhBo7w/scene.splinecode";
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setShouldRender(!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  if (!sceneUrl || !shouldRender) return null;

  const breakpointClass =
    minBreakpoint === "md"
      ? " hidden md:block"
      : minBreakpoint === "sm"
      ? " hidden sm:block"
      : minBreakpoint === "lg"
      ? " hidden lg:block"
      : "";

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className ?? ""}${breakpointClass}`}>
      <spline-viewer
        url={sceneUrl}
        style={{ width: "100%", height: "100%", contain: "strict" }}
        loading="lazy"
        events-target="global"
      />

      {/* Readability overlay over the 3D background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent dark:from-black/70 dark:via-black/40" />
    </div>
  );
};

export default HeroBackground3D;