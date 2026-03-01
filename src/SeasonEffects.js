import React, { useMemo } from "react";
import "./SeasonEffects.css";

/**
 * SeasonEffects — Renders animated particles based on the current season
 * Winter: snowflakes falling with drift
 * Summer: warm floating particles rising
 * Rain: water droplets falling fast
 */
const SeasonEffects = ({ season }) => {
  // Memoize particles so they don't re-randomize on every render
  const particles = useMemo(() => {
    const count = season === "rain" ? 100 : 60;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: season === "rain"
        ? 0.5 + Math.random() * 1
        : 4 + Math.random() * 8,
      delay: Math.random() * 5,
      size: season === "rain"
        ? 1 + Math.random() * 2
        : 2 + Math.random() * 6,
      drift: -20 + Math.random() * 40,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [season]);

  return (
    <div className={`season-effects ${season}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: season === "rain" ? `${p.size * 6}px` : `${p.size}px`,
            opacity: p.opacity,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SeasonEffects;
