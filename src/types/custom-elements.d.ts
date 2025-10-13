import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        loading?: "eager" | "lazy";
        "events-target"?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

export {};