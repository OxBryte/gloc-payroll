import React, { useRef, useState } from "react";
import wheelImg from "../../public/wheel.svg"; // ← put your uploaded PNG here

const ImageWheelSpinner = () => {
  const [angle, setAngle] = useState(0);
  const [isSpinning, setSpinning] = useState(false);
  const spins = 6; // full revolutions
  const duration = 4000; // ms total spin time
  const segmentCount = 5; // number of slices in your wheel
  const segmentDegree = 360 / segmentCount;

  const spin = () => {
    if (isSpinning) return;
    setSpinning(true);

    // choose a random slice
    const chosenIndex = Math.floor(Math.random() * segmentCount);

    // compute final rotation so that slice lands at top (0°)
    // we offset by half a segment so the center of the slice lines up
    const finalAngle =
      spins * 360 + (360 - (chosenIndex + 0.5) * segmentDegree);

    const start = performance.now();
    const animate = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setAngle(finalAngle * eased);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        alert(`You won slice #${chosenIndex + 1}!`);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div
      style={{
        position: "relative",
        width: 500,
        height: 500,
        margin: "0 auto",
      }}
    >
      {/* spinning wheel image */}
      <img
        src={wheelImg}
        alt="Wheel"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          transform: `rotate(${angle}deg)`,
          transition: "transform 0s", // all timing controlled in JS
        }}
      />

      {/* center “Spin” button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#fff",
          background: isSpinning ? "#888" : "#e91e63",
          border: "none",
          borderRadius: "24px",
          cursor: isSpinning ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {isSpinning ? "Spinning…" : "Spin"}
      </button>

      {/* top arrow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "24px solid #dddddd",
        }}
      />
    </div>
  );
};

export default ImageWheelSpinner;
