import React from "react";
import DottedMap from "dotted-map";

export default function Map() {
  // Create a map instance
  const map = new DottedMap({
    height: 40, // number of dots vertically
    grid: "diagonal", // or 'vertical', 'horizontal'
    dotSize: 1.5,
  });

  // Add some highlighted locations (optional)
  map.addPin({ lat: 37.7749, lng: -122.4194 }); // San Francisco
  map.addPin({ lat: 51.5074, lng: -0.1278 }); // London

  // Generate SVG
  const svg = map.getSVG({
    radius: 0.5,
    color: "#00ff88",
    shape: "circle", // or "square"
    background: "#181c20",
    pins: {
      color: "#ffe066",
      radius: 1.5,
    },
  });

  // Render SVG as React
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ width: "100%", height: "auto", background: "#181c20" }}
    />
  );
}
