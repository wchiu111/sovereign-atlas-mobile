/**
 * FrameworksScene
 *
 * Shared mobile framework renderer.
 * Framework identity and authored overview/reading data come from the registry.
 */

import { useEffect, useRef, useState } from "react";
import { T, W, H } from "../components/mobileShared";
import { mobileFrameworkFor } from "../frameworks/frameworkRegistry";
import FrameworkOverviewConstellation from "../frameworks/constellation/FrameworkOverviewConstellation";
import FrameworkPreviewDrawer from "../frameworks/surfaces/FrameworkPreviewDrawer";
import FrameworksChrome from "../frameworks/surfaces/FrameworksChrome";
import FrameworkSceneStyles from "../frameworks/surfaces/FrameworkSceneStyles";
import useFrameworksChoreography from "../frameworks/hooks/useFrameworksChoreography";
import {
  FRAMEWORK_DRAWER_CLOSE_DURATION,
  FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION,
} from "../frameworks/frameworkMotion";
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

function FrameworkReadingTopBar({
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
      <FrameworkReadingTopBar title={framework.title} onBack={onBack} />

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
  onSelectParent: () => void;
  onFrameworkOverview: () => void;
  onExplore: () => void;
  onCanvas: (evidenceId: string) => void;
  activeEvidenceId: string | null;
  returnFrameworkId?: MobileFrameworkId | null;
  onReturnFrameworkComplete?: () => void;
  onBack: () => void;
}

export default function FrameworksScene({
  state,
  activeFrameworkId,
  activeSectionId,
  setActiveSectionId,
  onSelectFramework,
  onSelectParent,
  onFrameworkOverview,
  onExplore,
  onCanvas,
  activeEvidenceId,
  returnFrameworkId = null,
  onReturnFrameworkComplete,
  onBack,
}: FrameworksSceneProps) {
  const framework = mobileFrameworkFor(activeFrameworkId);
  const {
    selectedId,
    drawerItem,
    drawerPhase,
    selectionPulseId,
    labelsVisible,
    chromeVisible,
    drawerVisible,
    prefersReducedMotion,
    ambientPaused,
    focusedEntryFrameworkId,
    focusedEntryProgress,
    isReturningFromReading,
    focusedReturnProgress,
    selectOverviewItem,
    enterFocusedReading,
  } = useFrameworksChoreography({
    state,
    activeFrameworkId,
    returnFrameworkId,
    onReturnFrameworkComplete,
    onSelectFramework,
    onSelectParent,
    onExplore,
  });

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
      <FrameworkSceneStyles />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Frameworks constellation"
      >
        <FrameworkOverviewConstellation
          selectedId={selectedId}
          selectionPulseId={selectionPulseId}
          ambientPaused={ambientPaused}
          labelsVisible={labelsVisible}
          focusedEntryId={focusedEntryFrameworkId}
          focusedEntryProgress={focusedEntryProgress}
          focusedReturnId={
            isReturningFromReading ? returnFrameworkId : null
          }
          focusedReturnProgress={focusedReturnProgress}
          reducedMotion={prefersReducedMotion}
          onSelect={selectOverviewItem}
        />
      </svg>

      <FrameworksChrome
        visible={chromeVisible}
        onExitToAtlas={onBack}
      />

      <FrameworkPreviewDrawer
        item={drawerItem}
        phase={drawerPhase}
        arrivalVisible={drawerVisible}
        reducedMotion={prefersReducedMotion}
        closeDurationMs={FRAMEWORK_DRAWER_CLOSE_DURATION}
        reducedDurationMs={FRAMEWORK_REDUCED_MOTION_DRAWER_DURATION}
        onExplore={() => {
          if (selectedId !== "frameworks") {
            enterFocusedReading(selectedId);
          }
        }}
      />
    </>
  );
}
