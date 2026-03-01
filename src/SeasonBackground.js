import React from "react";
import "./SeasonBackground.css";

/**
 * SeasonBackground — Full-viewport animated gradient background per season
 */
export default function SeasonBackground({ season }) {
  return (
    <div className={`season-bg ${season}`} aria-hidden="true" />
  );
}
