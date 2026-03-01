import { useEffect, useRef, useState } from "react";
import "./CursorEffect.css";

/**
 * CursorEffect — Shows a season-specific effect when mouse stops for 1 second
 * Winter: freeze glow effect (blue pulsing ring)
 * Summer: dry cracked earth effect (radial pattern)
 * Rain: water ripple effect (expanding rings)
 */
const CursorEffect = ({ season }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setShow(false);

      // Clear previous timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Show effect after 1 second of no movement
      timerRef.current = setTimeout(() => {
        setShow(true);
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="cursor-effect-wrapper"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
    >
      <div className={`cursor-effect ${season}`}>
        {/* Rain gets multiple ripple rings */}
        {season === "rain" && (
          <>
            <span className="ripple r1" />
            <span className="ripple r2" />
            <span className="ripple r3" />
          </>
        )}
        {/* Winter gets frost particles */}
        {season === "winter" && (
          <>
            <span className="frost-particle fp1" />
            <span className="frost-particle fp2" />
            <span className="frost-particle fp3" />
            <span className="frost-particle fp4" />
          </>
        )}
        {/* Summer gets heat crack lines */}
        {season === "summer" && (
          <>
            <span className="crack c1" />
            <span className="crack c2" />
            <span className="crack c3" />
            <span className="crack c4" />
          </>
        )}
      </div>
    </div>
  );
};

export default CursorEffect;
