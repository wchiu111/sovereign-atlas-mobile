/**
 * AtlasUtilitySheet — mobile-only universal utility layer.
 *
 * Interaction contract:
 * - Trigger lives below the Atlas header, not at the OS/browser edge.
 * - Tap trigger toggles the sheet.
 * - Pull down from the trigger opens progressively.
 * - Swipe up on the open sheet closes progressively.
 * - Tap the backdrop or press Escape to close.
 *
 * Phase 2 scope:
 * Menu architecture + gesture/shell only.
 * Destination wiring (Search, Observatory, Journey, About, Philosophy)
 * is intentionally deferred to the next pass.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { T } from "./mobileShared";

type DragOrigin = "handle" | "sheet";

const SHEET_TOP = 74;
const SHEET_HEIGHT = 418;
const OPEN_THRESHOLD = 0.42;
const TAP_SLOP = 8;

const items = [
  { id: "search", label: "SEARCH", glyph: "⌕", emphasized: true },
  { id: "observatory", label: "OBSERVATORY", glyph: "◉" },
  { id: "journey", label: "JOURNEY", glyph: "⌁" },
  { id: "about", label: "ABOUT WILSON", glyph: "○" },
  { id: "philosophy", label: "PHILOSOPHY", glyph: "◇" },
] as const;

export default function AtlasUtilitySheet() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const drag = useRef<{
    origin: DragOrigin;
    startY: number;
    startProgress: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);

  const activeProgress = dragging ? progress : open ? 1 : 0;

  useEffect(() => {
    if (!dragging) setProgress(open ? 1 : 0);
  }, [open, dragging]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const transform = `translate3d(0, ${(-SHEET_HEIGHT + SHEET_HEIGHT * activeProgress).toFixed(2)}px, 0)`;

  const backdropOpacity = useMemo(
    () => Math.max(0, Math.min(0.54, activeProgress * 0.54)),
    [activeProgress],
  );

  function beginDrag(event: React.PointerEvent<HTMLElement>, origin: DragOrigin) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = {
      origin,
      startY: event.clientY,
      startProgress: open ? 1 : 0,
      moved: false,
      pointerId: event.pointerId,
    };
    setProgress(open ? 1 : 0);
    setDragging(true);
  }

  function updateDrag(event: React.PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;

    const deltaY = event.clientY - current.startY;
    if (Math.abs(deltaY) > TAP_SLOP) current.moved = true;

    // Closed handle: downward motion reveals.
    // Open sheet: upward motion dismisses; a small downward pull remains clamped open.
    const next = current.startProgress + deltaY / SHEET_HEIGHT;
    setProgress(Math.max(0, Math.min(1, next)));
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;

    const wasTap = !current.moved;
    const finalProgress = progress;

    if (wasTap && current.origin === "handle") {
      setOpen((value) => !value);
    } else if (wasTap && current.origin === "sheet") {
      setOpen(true);
    } else {
      setOpen(finalProgress >= OPEN_THRESHOLD);
    }

    drag.current = null;
    setDragging(false);
  }

  function cancelDrag() {
    drag.current = null;
    setDragging(false);
    setProgress(open ? 1 : 0);
  }

  return (
    <>
      {/* Product-specific pull affordance.
          Only this local control captures the downward gesture, avoiding the OS edge. */}
      <button
        type="button"
        aria-label={open ? "Close Atlas utility menu" : "Open Atlas utility menu"}
        aria-expanded={open}
        onPointerDown={(event) => beginDrag(event, "handle")}
        onPointerMove={updateDrag}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
        style={{
          marginTop: 7,
          width: 58,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          padding: 0,
          background: "transparent",
          pointerEvents: "auto",
          cursor: open ? "n-resize" : "s-resize",
          touchAction: "none",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            display: "block",
            width: 30,
            height: 10,
            opacity: 0.46 + activeProgress * 0.22,
            transform: `translateY(${activeProgress * 2}px)`,
            transition: dragging ? "none" : "opacity 180ms ease, transform 240ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 4.5,
              height: 0.5,
              background: T.gold,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: 2,
              width: 5,
              height: 5,
              border: `0.5px solid ${T.gold}`,
              transform: `translateX(-50%) rotate(${45 + activeProgress * 45}deg)`,
              background: T.bg,
              transition: dragging ? "none" : "transform 240ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </span>
      </button>

      {/* Backdrop remains inside the Atlas viewport. */}
      <div
        aria-hidden={!open && !dragging}
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: `rgba(2,2,7,${backdropOpacity})`,
          backdropFilter: activeProgress > 0.02 ? `blur(${activeProgress * 4}px)` : "none",
          WebkitBackdropFilter: activeProgress > 0.02 ? `blur(${activeProgress * 4}px)` : "none",
          opacity: activeProgress > 0 ? 1 : 0,
          pointerEvents: activeProgress > 0.02 ? "auto" : "none",
          transition: dragging ? "none" : "opacity 260ms ease",
          zIndex: 40,
        }}
      />

      <section
        aria-label="Atlas utilities"
        aria-hidden={!open && !dragging}
        onPointerDown={(event) => beginDrag(event, "sheet")}
        onPointerMove={updateDrag}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
        style={{
          position: "fixed",
          top: SHEET_TOP,
          left: "50%",
          width: "min(390px, 100vw)",
          height: SHEET_HEIGHT,
          transform: `translateX(-50%) ${transform}`,
          zIndex: 50,
          boxSizing: "border-box",
          padding: "16px 26px 30px",
          border: "0.5px solid rgba(232,213,163,0.14)",
          borderTop: "none",
          borderRadius: "0 0 34px 34px",
          background: "linear-gradient(180deg, rgba(14,15,20,0.97) 0%, rgba(8,9,13,0.985) 100%)",
          boxShadow: `0 22px 70px rgba(0,0,0,${0.18 + activeProgress * 0.48})`,
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          pointerEvents: activeProgress > 0.02 ? "auto" : "none",
          touchAction: "none",
          transition: dragging ? "none" : "transform 420ms cubic-bezier(0.16,1,0.3,1), box-shadow 260ms ease",
          overflow: "hidden",
        }}
      >
        {/* Atlas-specific top marker; not a native sheet grabber. */}
        <div
          aria-hidden="true"
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <div style={{ position: "relative", width: 36, height: 10, opacity: 0.48 }}>
            <span style={{ position: "absolute", left: 0, right: 0, top: 4.5, height: 0.5, background: T.gold }} />
            <span style={{
              position: "absolute",
              left: "50%",
              top: 2,
              width: 5,
              height: 5,
              border: `0.5px solid ${T.gold}`,
              transform: "translateX(-50%) rotate(45deg)",
              background: "#0B0C10",
            }} />
          </div>
        </div>

        <div style={{ borderTop: "0.5px solid rgba(232,213,163,0.07)" }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              aria-disabled="true"
              style={{
                minHeight: 58,
                display: "grid",
                gridTemplateColumns: "30px 1fr",
                gap: 12,
                alignItems: "center",
                borderBottom: "0.5px solid rgba(232,213,163,0.07)",
                color: item.emphasized ? T.gold : "rgba(232,213,163,0.72)",
                opacity: item.emphasized ? 0.92 : 0.70,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: T.serif,
                  fontSize: item.id === "search" ? 22 : 17,
                  color: item.emphasized ? T.gold : "rgba(232,213,163,0.72)",
                }}
              >
                {item.glyph}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: item.emphasized ? 10 : 9,
                  letterSpacing: "0.20em",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, paddingTop: 15, borderTop: "0.5px solid rgba(232,213,163,0.06)" }}>
          <div style={{
            fontFamily: T.mono,
            fontSize: 7.5,
            letterSpacing: "0.22em",
            color: T.gold,
            opacity: 0.28,
          }}>
            THE SOVEREIGN ATLAS
          </div>
          <div style={{
            fontFamily: T.mono,
            fontSize: 6.5,
            letterSpacing: "0.14em",
            color: T.gold,
            opacity: 0.16,
            marginTop: 4,
          }}>
            UTILITY LAYER
          </div>
        </div>
      </section>
    </>
  );
}
