import { useState } from "react";
import { SovereignExperience } from "./experiences";
import { AtlasStateProvider } from "./state";
import MobileAtlas from "./atlas/mobile/MobileAtlas";

export default function App() {
  const [showMobile, setShowMobile] = useState(false);

  return (
    <>
      {showMobile ? (
        <MobileAtlas />
      ) : (
        <AtlasStateProvider>
          <SovereignExperience />
        </AtlasStateProvider>
      )}

      {/* Prototype toggle — floating pill, outside all Atlas components */}
      <button
        onClick={() => setShowMobile((v) => !v)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 99999,
          background: showMobile
            ? "rgba(232,213,163,0.18)"
            : "rgba(232,213,163,0.08)",
          border: "0.5px solid rgba(232,213,163,0.28)",
          borderRadius: 4,
          color: "rgba(232,213,163,0.72)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.22em",
          padding: "7px 12px",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
        }}
      >
        {showMobile ? "← ATLAS" : "MOBILE ↗"}
      </button>
    </>
  );
}
