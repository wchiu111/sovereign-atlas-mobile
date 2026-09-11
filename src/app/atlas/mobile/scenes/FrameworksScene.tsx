/**
 * FrameworksScene
 *
 * Shared mobile framework renderer.
 * Framework identity and authored overview/reading data come from the registry.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { T, ANIM, FADE, W, H } from "../components/mobileShared";
import {
  MOBILE_FRAMEWORKS,
  mobileFrameworkFor,
} from "../frameworks/frameworkRegistry";
import type {
  MobileFrameworkDocument,
  MobileFrameworkId,
  MobileFrameworkSection,
} from "../frameworks/mobileFrameworkTypes";

type FWState =
  | "frameworks-focus"
  | "framework-awakened"
  | "framework-overview"
  | "framework-reading"
  | "framework-evidence";

interface FrameworkNodeGeometry {
  id: MobileFrameworkId;
  x: number;
  y: number;
}

const FRAMEWORK_GEOMETRY: readonly FrameworkNodeGeometry[] = [
  { id: "authority-gradient", x: 90, y: 192 },
  { id: "behavioral-architecture", x: 293, y: 220 },
  { id: "relational-ai-literacy", x: 90, y: 360 },
  { id: "presence-navigation", x: 292, y: 372 },
  { id: "regenerative-systems", x: 150, y: 518 },
];

const FW_CTR = { x: 192, y: 358 };
const SELECTED_CENTER = { x: 195, y: 236 };

function geometryFor(id: MobileFrameworkId) {
  return (
    FRAMEWORK_GEOMETRY.find((item) => item.id === id) ??
    FRAMEWORK_GEOMETRY[1]
  );
}

function FrameworkNode({
  framework,
  x,
  y,
  selected,
  dimmed,
  onSelect,
}: {
  framework: MobileFrameworkDocument;
  x: number;
  y: number;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const c = T.frameworks;
  const coreR = selected ? 8 : 5;
  const innerR = selected ? 20 : 13;
  const outerR = selected ? 36 : 20;

  return (
    <g
      onClick={onSelect}
      style={{
        transform: `translate(${x}px,${y}px)`,
        opacity: dimmed ? 0.10 : 1,
        transition: ANIM,
        cursor: "pointer",
      }}
    >
      <circle
        r={outerR}
        fill={c}
        opacity={selected ? 0.09 : 0.04}
        pointerEvents="none"
      />
      <circle
        r={innerR}
        fill={c}
        opacity={selected ? 0.19 : 0.10}
        pointerEvents="none"
      />
      <circle
        r={selected ? 26 : 16}
        fill="none"
        stroke={c}
        strokeWidth={0.5}
        opacity={selected ? 0.30 : 0.09}
        pointerEvents="none"
      />
      <circle r={coreR} fill={c} pointerEvents="none" />
      <text
        y={coreR + 16}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={7.1}
        letterSpacing="0.12em"
        fill={c}
        opacity={0.74}
        pointerEvents="none"
      >
        {framework.title}
      </text>
      <circle r={28} fill="transparent" pointerEvents="all" />
    </g>
  );
}

function FrameworkConnections({ opacity }: { opacity: number }) {
  const c = T.frameworks;
  const points = FRAMEWORK_GEOMETRY;

  return (
    <g style={{ opacity, transition: FADE }}>
      {points.map((point) => (
        <line
          key={point.id}
          x1={FW_CTR.x}
          y1={FW_CTR.y}
          x2={point.x}
          y2={point.y}
          stroke={c}
          strokeWidth={0.25}
          strokeDasharray="2 8"
          opacity={0.10}
        />
      ))}
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        return (
          <line
            key={`${point.id}-${next.id}`}
            x1={point.x}
            y1={point.y}
            x2={next.x}
            y2={next.y}
            stroke={c}
            strokeWidth={0.26}
            strokeDasharray="3 7"
            opacity={0.12}
          />
        );
      })}
    </g>
  );
}

function FrameworkParent({ opacity }: { opacity: number }) {
  const c = T.frameworks;
  return (
    <g
      style={{
        transform: `translate(${FW_CTR.x}px,${FW_CTR.y}px)`,
        opacity,
        transition: FADE,
      }}
    >
      <circle r={72} fill="none" stroke={c} strokeWidth={0.3} opacity={0.05} />
      <circle r={48} fill="none" stroke={c} strokeWidth={0.35} opacity={0.08} />
      <circle r={28} fill="none" stroke={c} strokeWidth={0.4} opacity={0.12} />
      <circle r={10} fill={c} opacity={0.40} />
      <circle r={4} fill={c} opacity={0.80} />
      <text
        y={26}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={6.5}
        letterSpacing="0.2em"
        fill={c}
        opacity={0.66}
      >
        FRAMEWORKS
      </text>
    </g>
  );
}

function SectionStars({
  framework,
  opacity,
}: {
  framework: MobileFrameworkDocument;
  opacity: number;
}) {
  if (!framework.sections.length) return null;

  const c = T.frameworks;
  const radius = 94;
  const start = -160;
  const end = -30;
  const step =
    framework.sections.length > 1
      ? (end - start) / (framework.sections.length - 1)
      : 0;

  return (
    <g style={{ opacity, transition: FADE }}>
      {framework.sections.map((section, index) => {
        const deg = start + step * index;
        const rad = (deg * Math.PI) / 180;
        const x = SELECTED_CENTER.x + Math.cos(rad) * radius;
        const y = SELECTED_CENTER.y + Math.sin(rad) * radius;
        return (
          <g key={section.id}>
            <line
              x1={SELECTED_CENTER.x}
              y1={SELECTED_CENTER.y}
              x2={x}
              y2={y}
              stroke={c}
              strokeWidth={0.3}
              opacity={0.10}
            />
            <circle cx={x} cy={y} r={8} fill={c} opacity={0.08} />
            <circle cx={x} cy={y} r={2.6} fill={c} opacity={0.68} />
            <text
              x={x}
              y={y + 15}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize={5}
              letterSpacing="0.10em"
              fill={c}
              opacity={0.52}
            >
              {section.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FrameworkTopBar({
  title,
  onBack,
}: {
  title?: string;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "22px 22px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          minWidth: 44,
          minHeight: 44,
          border: "none",
          background: "transparent",
          padding: 0,
          textAlign: "left",
          pointerEvents: "auto",
          cursor: "pointer",
          fontFamily: T.mono,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: T.body,
          opacity: 0.72,
        }}
      >
        ‹ {title ? "FRAMEWORKS" : "ATLAS"}
      </button>
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 8.5,
          letterSpacing: "0.18em",
          color: T.frameworks,
          opacity: 0.78,
          textAlign: "right",
          maxWidth: 230,
        }}
      >
        {title ?? "FRAMEWORKS"}
      </div>
    </div>
  );
}

function FrameworkOverviewSurface({
  framework,
  onExplore,
}: {
  framework: MobileFrameworkDocument;
  onExplore: () => void;
}) {
  const c = T.frameworks;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `0.5px solid rgba(106,184,138,0.24)`,
        background: "rgba(5,5,10,0.94)",
        backdropFilter: "blur(28px)",
        padding: "22px 28px 34px",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          letterSpacing: "0.18em",
          color: c,
          opacity: 0.94,
          marginBottom: 7,
        }}
      >
        {framework.title}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {framework.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: T.mono,
              fontSize: 6.5,
              letterSpacing: "0.13em",
              color: c,
              opacity: 0.72,
              border: `0.5px solid rgba(106,184,138,0.25)`,
              borderRadius: 2,
              padding: "3px 7px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          height: 0.5,
          background: "rgba(232,213,163,0.09)",
          marginBottom: 15,
        }}
      />

      {[
        ["WHAT", framework.overview.what],
        ["KEY DISCOVERY", framework.overview.keyDiscovery],
      ].map(([label, body]) => (
        <div key={label} style={{ marginBottom: 13 }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.20em",
              color: T.accentGold,
              opacity: 0.72,
              marginBottom: 6,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 13,
              color: T.body,
              opacity: 0.84,
              lineHeight: 1.58,
            }}
          >
            {body}
          </div>
        </div>
      ))}

      {framework.status === "ready" ? (
        <button
          type="button"
          onClick={onExplore}
          style={{
            width: "100%",
            minHeight: 52,
            border: "none",
            borderTop: `0.5px solid rgba(106,184,138,0.16)`,
            background: "transparent",
            padding: "14px 0 0",
            marginTop: 4,
            fontFamily: T.mono,
            fontSize: 12.5,
            letterSpacing: "0.14em",
            color: c,
            cursor: "pointer",
          }}
        >
          EXPLORE →
        </button>
      ) : (
        <div
          style={{
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            borderTop: `0.5px solid rgba(106,184,138,0.12)`,
            marginTop: 4,
            paddingTop: 10,
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.16em",
            color: c,
            opacity: 0.42,
          }}
        >
          READING CONTENT · NEXT MIGRATION PASS
        </div>
      )}
    </div>
  );
}

function FrameworkReadingSurface({
  framework,
  activeSectionId,
  setActiveSectionId,
  onCanvas,
  onBack,
}: {
  framework: MobileFrameworkDocument;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  onCanvas: (evidenceId: string) => void;
  onBack: () => void;
}) {
  const current =
    framework.sections.find((section) => section.id === activeSectionId) ??
    framework.sections[0];

  useEffect(() => {
    if (!framework.sections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(framework.sections[0]?.id ?? "");
    }
  }, [activeSectionId, framework.sections, setActiveSectionId]);

  if (!current) return null;

  const evidence = framework.evidence.filter(
    (item) => item.sectionId === current.id || item.sectionId === "*",
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to bottom, rgba(5,5,10,0.72), rgba(5,5,10,0.99) 180px)",
      }}
    >
      <FrameworkTopBar title={framework.title} onBack={onBack} />

      <div
        style={{
          position: "absolute",
          top: 82,
          left: 0,
          right: 0,
          borderBottom: `0.5px solid rgba(106,184,138,0.12)`,
          overflowX: "auto",
          display: "flex",
          gap: 20,
          padding: "0 22px",
          minHeight: 52,
          alignItems: "center",
        }}
      >
        {framework.sections.map((section) => {
          const active = section.id === current.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSectionId(section.id)}
              style={{
                flex: "0 0 auto",
                minHeight: 44,
                border: "none",
                background: "transparent",
                padding: 0,
                fontFamily: T.mono,
                fontSize: 8,
                letterSpacing: "0.13em",
                color: active ? T.frameworks : T.body,
                opacity: active ? 0.94 : 0.44,
                cursor: "pointer",
              }}
            >
              {section.short} · {section.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 134,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          padding: "28px 28px 80px",
        }}
      >
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.18em",
            color: T.frameworks,
            opacity: 0.72,
            marginBottom: 10,
          }}
        >
          {current.label} · {current.readingTime} MIN READ
        </div>
        <h2
          style={{
            margin: "0 0 10px",
            fontFamily: T.serif,
            fontSize: 30,
            lineHeight: 1.08,
            color: "#F0E9D8",
          }}
        >
          {current.label
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </h2>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 19,
            lineHeight: 1.3,
            color: T.accentGold,
            opacity: 0.88,
            marginBottom: 18,
          }}
        >
          {current.subtitle}
        </div>
        <div
          style={{
            height: 0.5,
            background: "rgba(232,213,163,0.10)",
            marginBottom: 22,
          }}
        />

        {current.content.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            style={{
              margin: "0 0 18px",
              fontFamily: T.serif,
              fontSize: 14.5,
              color: "#F0E9D8",
              opacity: 0.86,
              lineHeight: 1.68,
            }}
          >
            {paragraph}
          </p>
        ))}

        <aside
          style={{
            borderLeft: `1.5px solid rgba(106,184,138,0.30)`,
            paddingLeft: 16,
            margin: "28px 0",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.18em",
              color: T.frameworks,
              opacity: 0.72,
              marginBottom: 8,
            }}
          >
            LAYER INSIGHT
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 14,
              color: T.body,
              opacity: 0.84,
              lineHeight: 1.58,
              fontStyle: "italic",
            }}
          >
            “{current.insight}”
          </div>
        </aside>

        {evidence.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onCanvas(item.id)}
            style={{
              width: "100%",
              borderRadius: 4,
              border: `0.5px solid rgba(106,184,138,0.22)`,
              overflow: "hidden",
              cursor: "pointer",
              padding: 0,
              background: "rgba(5,5,10,0.88)",
              textAlign: "left",
            }}
          >
            <img
              src={item.image}
              alt={item.alt}
              style={{
                width: "100%",
                height: 150,
                objectFit: item.imageFit,
                display: "block",
                opacity: 0.88,
              }}
            />
            <div style={{ padding: "11px 14px 13px" }}>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 7.5,
                  letterSpacing: "0.14em",
                  color: T.frameworks,
                  opacity: 0.74,
                  marginBottom: 5,
                }}
              >
                {item.number} · {item.title.toUpperCase()} · INSPECT →
              </div>
              <div
                style={{
                  fontFamily: T.serif,
                  fontSize: 13,
                  lineHeight: 1.52,
                  color: T.body,
                  opacity: 0.78,
                }}
              >
                {item.caption}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FrameworkEvidenceViewer({
  framework,
  section,
  evidenceId,
  onClose,
}: {
  framework: MobileFrameworkDocument;
  section: MobileFrameworkSection;
  evidenceId: string | null;
  onClose: () => void;
}) {
  const item =
    framework.evidence.find((evidence) => evidence.id === evidenceId) ??
    framework.evidence.find(
      (evidence) =>
        evidence.sectionId === section.id || evidence.sectionId === "*",
    );
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(
    null,
  );
  const lastTap = useRef(0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  if (!item) return null;

  const distance = () => {
    const values = [...pointers.current.values()];
    if (values.length < 2) return 0;
    return Math.hypot(
      values[1].x - values[0].x,
      values[1].y - values[0].y,
    );
  };

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Evidence: ${item.title}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "rgba(5,5,10,0.985)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          minHeight: 68,
          padding: "10px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `0.5px solid rgba(106,184,138,0.12)`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            minHeight: 44,
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: T.mono,
            fontSize: 8,
            letterSpacing: "0.15em",
            color: T.body,
            opacity: 0.74,
          }}
        >
          ‹ {section.label}
        </button>
        <div
          style={{
            textAlign: "right",
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.13em",
            color: T.frameworks,
            opacity: 0.72,
          }}
        >
          {item.number} · {item.title.toUpperCase()}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            pointers.current.set(event.pointerId, {
              x: event.clientX,
              y: event.clientY,
            });
            if (pointers.current.size === 1 && scale > 1) {
              panStart.current = {
                x: event.clientX,
                y: event.clientY,
                tx: translate.x,
                ty: translate.y,
              };
            }
            if (pointers.current.size === 2) {
              pinchStart.current = { distance: distance(), scale };
              panStart.current = null;
            }
          }}
          onPointerMove={(event) => {
            if (!pointers.current.has(event.pointerId)) return;
            pointers.current.set(event.pointerId, {
              x: event.clientX,
              y: event.clientY,
            });
            if (pointers.current.size >= 2 && pinchStart.current) {
              const nextDistance = distance();
              if (pinchStart.current.distance > 0) {
                setScale(
                  Math.min(
                    4,
                    Math.max(
                      1,
                      pinchStart.current.scale *
                        (nextDistance / pinchStart.current.distance),
                    ),
                  ),
                );
              }
            } else if (
              pointers.current.size === 1 &&
              panStart.current &&
              scale > 1
            ) {
              setTranslate({
                x: panStart.current.tx + event.clientX - panStart.current.x,
                y: panStart.current.ty + event.clientY - panStart.current.y,
              });
            }
          }}
          onPointerUp={(event) => {
            pointers.current.delete(event.pointerId);
            if (pointers.current.size < 2) pinchStart.current = null;
            if (pointers.current.size === 0) panStart.current = null;
          }}
          onPointerCancel={(event) => {
            pointers.current.delete(event.pointerId);
          }}
          onClick={() => {
            const now = Date.now();
            if (now - lastTap.current < 280) {
              if (scale > 1) reset();
              else setScale(2);
            }
            lastTap.current = now;
          }}
          style={{
            overflow: "hidden",
            touchAction: "none",
            background: "rgba(3,3,8,0.96)",
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
        >
          <img
            src={item.image}
            alt={item.alt}
            draggable={false}
            style={{
              width: "100%",
              display: "block",
              objectFit: item.imageFit,
              transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
              transformOrigin: "center center",
              userSelect: "none",
              WebkitUserDrag: "none",
            }}
          />
        </div>

        <div
          style={{
            minHeight: 44,
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `0.5px solid rgba(106,184,138,0.10)`,
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.16em",
              color: T.body,
              opacity: 0.46,
            }}
          >
            PINCH OR DOUBLE-TAP TO INSPECT
          </div>
          <button
            type="button"
            onClick={reset}
            style={{
              minWidth: 44,
              minHeight: 44,
              border: "none",
              background: "transparent",
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.14em",
              color: T.frameworks,
            }}
          >
            RESET
          </button>
        </div>

        <div style={{ padding: "20px 28px 70px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.16em",
              color: T.frameworks,
              opacity: 0.70,
              marginBottom: 8,
            }}
          >
            CAPTION
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 13.5,
              lineHeight: 1.62,
              color: T.body,
              opacity: 0.84,
              marginBottom: 18,
            }}
          >
            {item.caption}
          </div>
          <div
            style={{
              borderTop: "0.5px solid rgba(232,213,163,0.08)",
              paddingTop: 16,
              fontFamily: T.serif,
              fontSize: 13,
              lineHeight: 1.62,
              color: T.body,
              opacity: 0.70,
            }}
          >
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrameworksSceneProps {
  state: FWState;
  activeFrameworkId: MobileFrameworkId;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  onSelectFramework: (id: MobileFrameworkId) => void;
  onFrameworkOverview: () => void;
  onExplore: () => void;
  onCanvas: (evidenceId: string) => void;
  activeEvidenceId: string | null;
  onBack: () => void;
}

export default function FrameworksScene({
  state,
  activeFrameworkId,
  activeSectionId,
  setActiveSectionId,
  onSelectFramework,
  onFrameworkOverview,
  onExplore,
  onCanvas,
  activeEvidenceId,
  onBack,
}: FrameworksSceneProps) {
  const framework = mobileFrameworkFor(activeFrameworkId);
  const selectedGeometry = geometryFor(activeFrameworkId);
  const selected =
    state === "framework-awakened" || state === "framework-overview";

  const currentSection =
    framework.sections.find((section) => section.id === activeSectionId) ??
    framework.sections[0];

  if (state === "framework-reading") {
    return (
      <FrameworkReadingSurface
        framework={framework}
        activeSectionId={activeSectionId}
        setActiveSectionId={setActiveSectionId}
        onCanvas={onCanvas}
        onBack={onBack}
      />
    );
  }

  if (state === "framework-evidence" && currentSection) {
    return (
      <FrameworkEvidenceViewer
        framework={framework}
        section={currentSection}
        evidenceId={activeEvidenceId}
        onClose={onBack}
      />
    );
  }

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Frameworks constellation"
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={FW_CTR.x}
              y1={FW_CTR.y}
              x2={FW_CTR.x + Math.cos(r) * 320}
              y2={FW_CTR.y + Math.sin(r) * 320}
              stroke={T.frameworks}
              strokeWidth={0.18}
              opacity={0.035}
            />
          );
        })}

        <FrameworkConnections opacity={selected ? 0.08 : 1} />
        <FrameworkParent opacity={selected ? 0.08 : 0.20} />

        {MOBILE_FRAMEWORKS.map((item) => {
          const geometry = geometryFor(item.id);
          const isActive = item.id === activeFrameworkId;
          const x = selected && isActive ? SELECTED_CENTER.x : geometry.x;
          const y = selected && isActive ? SELECTED_CENTER.y : geometry.y;

          return (
            <FrameworkNode
              key={item.id}
              framework={item}
              x={x}
              y={y}
              selected={selected && isActive}
              dimmed={selected && !isActive}
              onSelect={() => {
                if (state === "frameworks-focus") {
                  onSelectFramework(item.id);
                  return;
                }
                if (
                  isActive &&
                  state === "framework-awakened"
                ) {
                  onFrameworkOverview();
                  return;
                }
                onSelectFramework(item.id);
              }}
            />
          );
        })}

        <SectionStars
          framework={framework}
          opacity={selected ? 0.82 : 0}
        />
      </svg>

      <FrameworkTopBar
        onBack={onBack}
        title={selected ? framework.title : undefined}
      />

      {state === "framework-overview" && (
        <FrameworkOverviewSurface
          framework={framework}
          onExplore={onExplore}
        />
      )}
    </>
  );
}
