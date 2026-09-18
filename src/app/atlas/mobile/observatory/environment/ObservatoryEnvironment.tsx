import type { ReactNode } from "react";
import observatoryBackground from "@/assets/observatory-mobile.jpg";
import type { ObservatoryCameraTarget } from "../observatoryTypes";
import ObservatoryAmbientLayer from "./ObservatoryAmbientLayer";

export default function ObservatoryEnvironment({
  camera,
  reducedMotion,
  paused = false,
  children,
}: {
  camera: ObservatoryCameraTarget;
  reducedMotion: boolean;
  paused?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#04060A",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(${camera.translateX}px, ${camera.translateY}px, 0) scale(${camera.scale})`,
          transformOrigin: "50% 48%",
          transition: reducedMotion
            ? "opacity 160ms ease"
            : "transform 1280ms cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
        }}
      >
        <img
          src={observatoryBackground}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 50%",
            userSelect: "none",
            pointerEvents: "none",
            filter:
              "brightness(0.72) saturate(0.78) contrast(1.08) hue-rotate(-4deg)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(2,4,10,0.10), rgba(2,4,10,0.02) 36%, rgba(2,4,10,0.20) 100%), radial-gradient(circle at 50% 18%, rgba(61,73,120,0.09), transparent 47%), radial-gradient(circle at 50% 62%, transparent 35%, rgba(1,3,8,0.20) 92%)",
            pointerEvents: "none",
          }}
        />

        <ObservatoryAmbientLayer paused={paused} />

        {children}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(2,3,8,0.20), transparent 17%, transparent 76%, rgba(2,3,8,0.42)), radial-gradient(ellipse at center, transparent 45%, rgba(2,3,8,0.20) 100%)",
        }}
      />
    </div>
  );
}
