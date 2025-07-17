import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const PixelPrintingAnimation = ({
  svgPath = "/West-Africa.svg",
  dotSize = 1,
  dotSpacing = 4,
  dotColor = 0x00ff88,
  dotHighlightColor = 0xfffff,
  bgColor = 0x181c20,
  stagger = 0.005,
  // Optionally allow width/height for the SVG render
  imageWidth = 100,
  imageHeight = 100,
}) => {
  const mountRef = useRef();

  useEffect(() => {
    let cleanup = () => {};
    let renderer, scene;
    let animationFrameId;

    // --- 1. Load SVG and draw to canvas ---
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = svgPath;
    img.onload = () => {
      // Draw SVG to canvas
      const canvas2d = document.createElement("canvas");
      canvas2d.width = imageWidth;
      canvas2d.height = imageHeight;
      const ctx = canvas2d.getContext("2d");
      ctx.clearRect(0, 0, imageWidth, imageHeight);
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
      const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;

      // --- 2. Find pixel positions for dots ---
      const dotPositions = [];
      for (let y = 0; y < imageHeight; y += dotSpacing) {
        for (let x = 0; x < imageWidth; x += dotSpacing) {
          let found = false;
          for (let dy = 0; dy < dotSpacing && !found; dy++) {
            for (let dx = 0; dx < dotSpacing && !found; dx++) {
              const px = x + dx + (y + dy) * imageWidth;
              if (
                px * 4 + 3 < imageData.length &&
                imageData[px * 4 + 3] > 128
              ) {
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
      scene = new THREE.Scene();
      scene.background = new THREE.Color(bgColor);

      const totalWidth = imageWidth;
      const totalHeight = imageHeight;
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

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(bgColor);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.margin = "0 auto";
      renderer.domElement.style.background = "#181c20";

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);
      }

      // --- 4. Create dot meshes ---
      const DOT_GEOMETRY = new THREE.BoxGeometry(dotSize, dotSize, dotSize);
      const dots = [];
      dotPositions.forEach((pos, i) => {
        const material = new THREE.MeshBasicMaterial({
          color: dotColor,
          transparent: true,
          opacity: 0,
        });
        // Store the final position
        const finalX = pos.x + offsetX;
        const finalY = -pos.y + offsetY;
        const finalZ = 0;
        // Set initial position (randomized, e.g., from outside the view)
        const angle = Math.random() * Math.PI * 2;
        const radius =
          Math.max(totalWidth, totalHeight) * 0.8 + Math.random() * 100;
        const dot = new THREE.Mesh(DOT_GEOMETRY, material);
        dot.position.x = Math.cos(angle) * radius;
        dot.position.y = Math.sin(angle) * radius;
        dot.position.z = -10 + Math.random() * 200;
        dot.scale.set(0.2, 0.2, 0.2);
        scene.add(dot);
        dots.push(dot);
        // Animate to final position
        gsap.to(dot.position, {
          x: finalX,
          y: finalY,
          z: finalZ,
          delay: i * stagger,
          duration: 0.4,
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
            each: stagger,
            grid: [
              Math.ceil(imageHeight / dotSpacing),
              Math.ceil(imageWidth / dotSpacing),
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
            each: stagger,
            grid: [
              Math.ceil(imageHeight / dotSpacing),
              Math.ceil(imageWidth / dotSpacing),
            ],
            from: "start",
          },
          ease: "back.out(2)",
        }
      );

      // --- 6. Render loop ---
      let mouse = { x: 0, y: 0 };
      let mouse3D = { x: 0, y: 0 };
      renderer.domElement.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse3D.x = mouse.x * ((viewSize * aspect) / 2);
        mouse3D.y = mouse.y * (viewSize / 2);
      });

      function animate() {
        animationFrameId = requestAnimationFrame(animate);
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
          const baseColor = new THREE.Color(dotColor);
          const highlightColor = new THREE.Color(dotHighlightColor);
          dot.material.color.lerpColors(baseColor, highlightColor, t);
        });
        renderer.render(scene, camera);
      }
      animate();

      // --- 7. Responsive resize ---
      const handleResize = () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = (-viewSize * aspect) / 2;
        camera.right = (viewSize * aspect) / 2;
        camera.top = viewSize / 2;
        camera.bottom = -viewSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        if (renderer) renderer.dispose();
        if (scene) {
          scene.traverse((obj) => {
            if (obj.isMesh) {
              obj.geometry.dispose();
              obj.material.dispose();
            }
          });
          scene.clear();
        }
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    };
    return cleanup;
  }, [
    svgPath,
    dotSize,
    dotSpacing,
    dotColor,
    dotHighlightColor,
    bgColor,
    stagger,
    imageWidth,
    imageHeight,
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
