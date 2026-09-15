// Figma-ready framework color update for MobileAtlasLandingExploration.tsx
// Apply these changes to the corresponding sections of your existing file.

import { STELLAR_PALETTE } from "../constellation/stellarPalette";

type FrameworkStellarType = "purpose" | "strategy" | "relational";

interface FwDef {
  id: string;
  label: string;
  x: number;
  y: number;
  stellarType?: FrameworkStellarType;
}

export const FW_FRAMEWORKS: FwDef[] = [
  { id: "authority-gradient",     label: "AUTHORITY GRADIENT",     x: 90,  y: 192, stellarType: "purpose" },
  { id: "model-design",           label: "MODEL DESIGN",           x: 293, y: 220, stellarType: "strategy" },
  { id: "relational-ai-literacy", label: "RELATIONAL AI LITERACY", x: 90,  y: 360, stellarType: "relational" },
  { id: "presence-navigation",    label: "PRESENCE NAVIGATION",    x: 292, y: 372, stellarType: "strategy" },
  { id: "regenerative-systems",   label: "REGENERATIVE SYSTEMS",   x: 118, y: 512, stellarType: "relational" },
  { id: "application-kit",        label: "APPLICATION KIT",        x: 270, y: 510 },
];

export function FrameworkNode({
  label, cx, cy, stellarType, awakened, onClick,
}: {
  label: string;
  cx: number;
  cy: number;
  stellarType?: FrameworkStellarType;
  awakened: boolean;
  onClick?: () => void;
}) {
  const domainColor = "#6AB88A";
  const semanticColor = stellarType ? STELLAR_PALETTE[stellarType] : domainColor;
  const coreR  = awakened ? 8  : 5;
  const innerR = awakened ? 20 : 13;
  const outerR = awakened ? 36 : 20;

  return (
    <g style={{ transform: `translate(${cx}px,${cy}px)`, transition: "transform 0.95s cubic-bezier(0.16,1,0.3,1)" }}>
      <circle r={22} fill="transparent" onClick={onClick} style={{ cursor: "pointer" }} />
      <circle r={outerR} fill={domainColor} opacity={awakened ? 0.09 : 0.04} />
      <circle r={innerR} fill={semanticColor} opacity={awakened ? 0.19 : 0.10} />
      <circle
        r={awakened ? 26 : 16}
        fill="none"
        stroke={domainColor}
        strokeWidth={0.5}
        opacity={awakened ? 0.30 : 0.09}
      />
      <circle r={coreR} fill={semanticColor} />
      <text
        y={coreR + 16}
        textAnchor="middle"
        fontFamily="'DM Mono', monospace"
        fontSize={7.5}
        letterSpacing="0.13em"
        fill={domainColor}
        opacity={0.52}
      >
        {label}
      </text>
    </g>
  );
}

// In the sibling-node render, pass:
// stellarType={f.stellarType}
//
// For Model Design / Behavioral Architecture, pass:
// stellarType="strategy"
