import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const PixelPrintingAnimation = ({
  text = "Hello Base West Africa",
  dotSize = 8,
  dotSpacing = 12,
  dotColor = 0x00ff88,
  bgColor = 0x181c20,
  font = "bold 48px Arial",
  stagger = 0.015,
}) => {
  const mountRef = useRef();

  useEffect(() => {
    // --- 1. Draw text to hidden canvas and extract pixel data ---
    const DOT_GEOMETRY = new THREE.SphereGeometry(dotSize / 2, 12, 12);
    const canvas2d = document.createElement("canvas");
    const ctx = canvas2d.getContext("2d");
    ctx.font = font;
    const textMetrics = ctx.measureText(text);
    const textWidth = Math.ceil(textMetrics.width);
    const textHeight = 60;
    canvas2d.width = textWidth;
    canvas2d.height = textHeight;
    ctx.font = font;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.fillText(text, 0, 0);
    const imageData = ctx.getImageData(0, 0, textWidth, textHeight).data;

    // --- 2. Find pixel positions for dots ---
    const dotPositions = [];
    for (let y = 0; y < textHeight; y += dotSpacing) {
      for (let x = 0; x < textWidth; x += dotSpacing) {
        let found = false;
        for (let dy = 0; dy < dotSpacing && !found; dy++) {
          for (let dx = 0; dx < dotSpacing && !found; dx++) {
            const px = x + dx + (y + dy) * textWidth;
            if (px * 4 + 3 < imageData.length && imageData[px * 4 + 3] > 128) {
              found = true;
            }
          }
        }
        if (found) {
          dotPositions.push({ x, y });
        }
      }
    }

    // --- 3. Setup Three.js scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const totalWidth = textWidth;
    const totalHeight = textHeight;
    const offsetX = -totalWidth / 2;
    const offsetY = totalHeight / 2;

    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = Math.max(totalWidth, totalHeight) * 1.2;
    const camera = new THREE.OrthographicCamera(
      (-viewSize * aspect) / 2,
      (viewSize * aspect) / 2,
      viewSize / 2,
      -viewSize / 2,
      1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(bgColor);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.margin = "0 auto";
    renderer.domElement.style.background = "#181c20";

    // Clear and append renderer
    if (mountRef.current) {
      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(renderer.domElement);
    }

    // --- 4. Create dot meshes ---
    const dots = [];
    dotPositions.forEach((pos) => {
      const material = new THREE.MeshBasicMaterial({
        color: dotColor,
        transparent: true,
        opacity: 0,
      });
      const dot = new THREE.Mesh(DOT_GEOMETRY, material);
      dot.position.x = pos.x + offsetX;
      dot.position.y = -pos.y + offsetY;
      dot.position.z = 0;
      dot.scale.set(0.2, 0.2, 0.2);
      scene.add(dot);
      dots.push(dot);
    });

    // --- 5. Animation loop ---
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // --- 6. GSAP Animation ---
    gsap.to(
      dots.map((d) => d.scale),
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        stagger: stagger,
        ease: "back.out(1.7)",
      }
    );
    gsap.to(
      dots.map((d) => d.material),
      {
        opacity: 1,
        duration: 0.6,
        stagger: stagger,
        ease: "back.out(1.7)",
      }
    );

    // --- 7. Handle window resize ---
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const viewSize = Math.max(totalWidth, totalHeight) * 1.2;
      camera.left = (-viewSize * aspect) / 2;
      camera.right = (viewSize * aspect) / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      dots.forEach((dot) => {
        dot.geometry.dispose();
        dot.material.dispose();
      });
      scene.clear();
    };
  }, [text, dotSize, dotSpacing, dotColor, bgColor, font, stagger]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        background: "#181c20",
        overflow: "hidden",
      }}
    />
  );
};

export default PixelPrintingAnimation;
