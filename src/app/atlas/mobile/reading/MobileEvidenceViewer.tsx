import { useEffect, useRef, useState } from "react";
import { T } from "../components/mobileShared";
import type { MobileEvidenceItem } from "./sovereignAtlasEvidence";

function InspectableEvidenceImage({ item }: { item: MobileEvidenceItem }) {
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(
    null,
  );
  const lastTap = useRef(0);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchStart.current = null;
    panStart.current = null;
  };

  const distance = () => {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  };

  const clampScale = (next: number) => Math.min(4, Math.max(1, next));

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
      pinchStart.current = {
        distance: distance(),
        scale,
      };
      panStart.current = null;
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const nextDistance = distance();
      if (pinchStart.current.distance > 0) {
        setScale(
          clampScale(
            pinchStart.current.scale *
              (nextDistance / pinchStart.current.distance),
          ),
        );
      }
      return;
    }

    if (pointers.current.size === 1 && panStart.current && scale > 1) {
      setTranslate({
        x: panStart.current.tx + (event.clientX - panStart.current.x),
        y: panStart.current.ty + (event.clientY - panStart.current.y),
      });
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
  }

  function onDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (scale > 1) reset();
      else setScale(2);
    }
    lastTap.current = now;
  }

  return (
    <>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={onDoubleTap}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 310,
          maxHeight: 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(3,3,8,0.99)",
          touchAction: "none",
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
      >
        <img
          src={item.image}
          alt={item.alt}
          draggable={false}
          style={{
            width: "100%",
            maxHeight: 520,
            objectFit: item.imageFit,
            display: "block",
            transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
            transformOrigin: "center center",
            transition: pointers.current.size ? "none" : "transform 160ms ease",
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
          borderBottom: `0.5px solid ${T.identityGold}22`,
        }}
      >
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.16em",
            color: T.body,
            opacity: 0.34,
          }}
        >
          PINCH OR DOUBLE-TAP TO INSPECT
        </div>

        <button
          type="button"
          onClick={reset}
          disabled={scale === 1 && translate.x === 0 && translate.y === 0}
          style={{
            minWidth: 44,
            minHeight: 44,
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.14em",
            color: T.identityGold,
            opacity:
              scale === 1 && translate.x === 0 && translate.y === 0 ? 0.24 : 0.76,
            cursor:
              scale === 1 && translate.x === 0 && translate.y === 0
                ? "default"
                : "pointer",
          }}
        >
          RESET
        </button>
      </div>
    </>
  );
}

export default function MobileEvidenceViewer({
  item,
  sectionLabel,
  onClose,
}: {
  item: MobileEvidenceItem;
  sectionLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Evidence: ${item.title}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        background: "rgba(5,5,10,0.985)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div
        style={{
          minHeight: 68,
          padding: "12px 20px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: `0.5px solid ${T.identityGold}22`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            minHeight: 44,
            border: "none",
            background: "transparent",
            padding: "0 12px 0 0",
            fontFamily: T.mono,
            fontSize: 8,
            letterSpacing: "0.14em",
            color: T.body,
            opacity: 0.76,
            cursor: "pointer",
          }}
        >
          ‹ {sectionLabel}
        </button>

        <div style={{ minWidth: 0, textAlign: "right" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 7.5,
              letterSpacing: "0.12em",
              color: T.identityGold,
              opacity: 0.82,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.number} · {item.title.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 3,
              fontFamily: T.mono,
              fontSize: 6.5,
              letterSpacing: "0.12em",
              color: T.body,
              opacity: 0.42,
            }}
          >
            {item.type.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <InspectableEvidenceImage item={item} />

        <div style={{ padding: "20px 26px 58px" }}>
          <div
            style={{
              marginBottom: 8,
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.16em",
              color: T.identityGold,
              opacity: 0.64,
            }}
          >
            CAPTION
          </div>
          <div
            style={{
              marginBottom: 20,
              fontFamily: T.serif,
              fontSize: 14,
              lineHeight: 1.6,
              color: T.body,
              opacity: 0.86,
            }}
          >
            {item.caption}
          </div>

          <div
            style={{
              paddingTop: 16,
              borderTop: `0.5px solid ${T.identityGold}1F`,
              fontFamily: T.serif,
              fontSize: 13.5,
              lineHeight: 1.62,
              color: T.body,
              opacity: 0.68,
            }}
          >
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
}
