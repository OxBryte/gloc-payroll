import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const PixelPrintingAnimation = ({
  text = "Hello Base West Africa",
  dotSize = 8,
  dotSpacing = 12,
  dotColor = 0x00ff88,
  dotHighlightColor = 0xffffff,
  bgColor = 0x181c20,
  font = "bold 48px Arial",
  stagger = 0.015,
}) => {
  const mountRef = useRef();

  useEffect(() => {
    // --- 1. Draw text to hidden canvas and extract pixel data ---
    const DOT_COLOR = dotColor;
    const DOT_HIGHLIGHT_COLOR = dotHighlightColor;
    const DOT_SPACING = dotSpacing;
    const DOT_SIZE = dotSize;
    const STAGGER = stagger;
    const DOT_GEOMETRY = new THREE.SphereGeometry(DOT_SIZE / 2, 12, 12);
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
    for (let y = 0; y < textHeight; y += DOT_SPACING) {
      for (let x = 0; x < textWidth; x += DOT_SPACING) {
        let found = false;
        for (let dy = 0; dy < DOT_SPACING && !found; dy++) {
          for (let dx = 0; dx < DOT_SPACING && !found; dx++) {
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

    // --- 4. Create dot meshes and animate to final position ---
    const dots = [];
    dotPositions.forEach((pos, i) => {
      const material = new THREE.MeshBasicMaterial({
        color: DOT_COLOR,
        transparent: true,
        opacity: 0,
      });
      const dot = new THREE.Mesh(DOT_GEOMETRY, material);
      // Start at center
      dot.position.x = 0;
      dot.position.y = 0;
      dot.position.z = 0;
      dot.scale.set(0.2, 0.2, 0.2); // Start small for pop-in effect
      scene.add(dot);
      dots.push(dot);

      // Animate to final position
      const finalX = pos.x + offsetX;
      const finalY = -pos.y + offsetY;
      const finalZ = 0;
      gsap.to(dot.position, {
        x: finalX,
        y: finalY,
        z: finalZ,
        delay: i * STAGGER,
        duration: 1.2,
        ease: "expo.out",
      });
    });

    // --- 5. Animate dots in with GSAP ---
    gsap.to(
      dots.map((dot) => dot.material),
      {
        opacity: 1,
        duration: 0.5,
        stagger: {
          each: STAGGER,
          grid: [
            Math.ceil(totalHeight / DOT_SPACING),
            Math.ceil(totalWidth / DOT_SPACING),
          ],
          from: "start",
        },
        ease: "power2.out",
      }
    );
    gsap.to(
      dots.map((dot) => dot.scale),
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        stagger: {
          each: STAGGER,
          grid: [
            Math.ceil(totalHeight / DOT_SPACING),
            Math.ceil(totalWidth / DOT_SPACING),
          ],
          from: "start",
        },
        ease: "back.out(2)",
      }
    );

    // --- 6. Render loop with mouse interaction and color interpolation ---
    let mouse = { x: 0, y: 0 };
    let mouse3D = { x: 0, y: 0 };
    renderer.domElement.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse3D.x = mouse.x * ((viewSize * aspect) / 2);
      mouse3D.y = mouse.y * (viewSize / 2);
    });

    function animate() {
      requestAnimationFrame(animate);
      dots.forEach((dot) => {
        const dx = dot.position.x - mouse3D.x;
        const dy = dot.position.y - mouse3D.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 40;
        const minScale = 1;
        const maxScale = 1.8;
        const t = Math.max(0, 1 - dist / maxDist);
        const targetScale = minScale + (maxScale - minScale) * t;
        dot.scale.x += (targetScale - dot.scale.x) * 0.2;
        dot.scale.y += (targetScale - dot.scale.y) * 0.2;
        dot.scale.z += (targetScale - dot.scale.z) * 0.2;
        // Color interpolation
        const baseColor = new THREE.Color(DOT_COLOR);
        const highlightColor = new THREE.Color(DOT_HIGHLIGHT_COLOR);
        dot.material.color.lerpColors(baseColor, highlightColor, t);
      });
      renderer.render(scene, camera);
    }
    animate();

    // --- 7. Responsive resize ---
    window.addEventListener("resize", () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = (-viewSize * aspect) / 2;
      camera.right = (viewSize * aspect) / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cleanup
    return () => {
      renderer.dispose();
      dots.forEach((dot) => {
        dot.geometry.dispose();
        dot.material.dispose();
      });
      scene.clear();
    };
  }, [
    text,
    dotSize,
    dotSpacing,
    dotColor,
    dotHighlightColor,
    bgColor,
    font,
    stagger,
  ]);

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
