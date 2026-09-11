export default function FrameworkSceneStyles() {
  return (
    <style>{`
      @keyframes frameworkAvailableHaloBreath {
        0%, 100% {
          transform: scale(1);
          opacity: 0.92;
        }
        50% {
          transform: scale(1.08);
          opacity: 1;
        }
      }

      @keyframes frameworkAvailableCoreBreath {
        0%, 100% {
          transform: scale(1);
          opacity: 0.96;
        }
        50% {
          transform: scale(1.018);
          opacity: 1;
        }
      }

      @keyframes frameworkSelectedHaloBreath {
        0%, 100% {
          transform: scale(1);
          opacity: 0.90;
        }
        50% {
          transform: scale(1.035);
          opacity: 1;
        }
      }

      @keyframes frameworkSelectedCoreBreath {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.010);
        }
      }

      @keyframes frameworkParentAvailableBreath {
        0%, 100% {
          transform: scale(1);
          opacity: 0.34;
        }
        50% {
          transform: scale(1.026);
          opacity: 0.76;
        }
      }

      @keyframes frameworkParentSelectedBreath {
        0%, 100% {
          transform: scale(1);
          opacity: 0.96;
        }
        50% {
          transform: scale(1.012);
          opacity: 1;
        }
      }

      @keyframes frameworkSelectionPulse {
        0% {
          transform: scale(1);
          opacity: 0.92;
        }
        38% {
          transform: scale(1.16);
          opacity: 1;
        }
        100% {
          transform: scale(1.04);
          opacity: 1;
        }
      }

      .framework-halo-available,
      .framework-halo-selected,
      .framework-core-available,
      .framework-core-selected,
      .framework-parent-available,
      .framework-parent-selected,
      .framework-selection-pulse {
        transform-box: fill-box;
        transform-origin: center;
        will-change: transform, opacity;
      }

      .framework-halo-available {
        animation: frameworkAvailableHaloBreath 4.2s ease-in-out infinite;
      }

      .framework-core-available {
        animation: frameworkAvailableCoreBreath 4.2s ease-in-out infinite;
      }

      .framework-halo-selected {
        animation: frameworkSelectedHaloBreath 5.8s ease-in-out infinite;
      }

      .framework-core-selected {
        animation: frameworkSelectedCoreBreath 5.8s ease-in-out infinite;
      }

      .framework-parent-available {
        animation: frameworkParentAvailableBreath 5.2s ease-in-out infinite;
      }

      .framework-parent-selected {
        animation: frameworkParentSelectedBreath 6.2s ease-in-out infinite;
      }

      .framework-selection-pulse {
        animation: frameworkSelectionPulse 420ms cubic-bezier(0.22,1,0.36,1) both;
      }

      .framework-ambient-paused {
        animation-play-state: paused !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .framework-halo-available,
        .framework-halo-selected,
        .framework-core-available,
        .framework-core-selected,
        .framework-parent-available,
        .framework-parent-selected,
        .framework-selection-pulse {
          animation: none !important;
          transform: none !important;
        }
      }
    `}</style>
  );
}
