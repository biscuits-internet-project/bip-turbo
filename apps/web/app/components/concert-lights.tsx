import { useEffect, useRef } from "react";

interface LightBeam {
  x: number;
  y: number;
  angle: number;
  color: string;
  intensity: number;
  width: number;
  type: "laser" | "spotlight" | "moving-head";
  speed: number;
  targetAngle?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function ConcertLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Subtle ambient lighting setup - purple and green only
    const lightColors = [
      "#8B5CF6", // Purple
      "#10B981", // Green
      "#A855F7", // Light Purple
      "#059669", // Dark Green
    ];

    let time = 0;
    let lightBeams: LightBeam[] = [];
    const particles: Particle[] = [];

    // Initialize lighting rig
    const initLights = () => {
      lightBeams = [];

      // Ambient beams from off-screen bottom
      for (let i = 0; i < 3; i++) {
        lightBeams.push({
          x: canvas.width * 0.2 + (i * canvas.width * 0.6) / 2,
          y: canvas.height + 50, // Off-screen below
          angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.3,
          color: lightColors[Math.floor(Math.random() * lightColors.length)],
          intensity: 0.12 + Math.random() * 0.15,
          width: 1 + Math.random() * 2,
          type: "laser",
          speed: 0.01 + Math.random() * 0.02,
        });
      }

      // Moving lights from off-screen top
      for (let i = 0; i < 3; i++) {
        lightBeams.push({
          x: canvas.width * 0.2 + (i * canvas.width * 0.6) / 2,
          y: -100, // Off-screen above
          angle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          color: lightColors[Math.floor(Math.random() * lightColors.length)],
          intensity: 0.08 + Math.random() * 0.15,
          width: 6 + Math.random() * 10,
          type: "moving-head",
          speed: 0.005 + Math.random() * 0.01,
          targetAngle: Math.PI / 2 + (Math.random() - 0.5) * 0.8,
        });
      }

      // Side lights from off-screen edges
      for (let i = 0; i < 2; i++) {
        lightBeams.push({
          x: i === 0 ? -80 : canvas.width + 80, // Off-screen left/right
          y: canvas.height * (0.3 + Math.random() * 0.4),
          angle:
            i === 0
              ? (Math.random() * Math.PI) / 4 + Math.PI / 8
              : Math.PI - (Math.random() * Math.PI) / 4 - Math.PI / 8,
          color: lightColors[Math.floor(Math.random() * lightColors.length)],
          intensity: 0.06 + Math.random() * 0.12,
          width: 4 + Math.random() * 8,
          type: "spotlight",
          speed: 0.003 + Math.random() * 0.008,
        });
      }
    };

    // Draw volumetric light beam
    const drawBeam = (beam: LightBeam) => {
      const length = beam.type === "laser" ? canvas.height * 0.8 : canvas.height * 0.6;
      const endX = beam.x + Math.cos(beam.angle) * length;
      const endY = beam.y + Math.sin(beam.angle) * length;

      // Create gradient for volumetric effect
      const gradient = ctx.createLinearGradient(beam.x, beam.y, endX, endY);

      if (beam.type === "laser") {
        // Sharp laser beam
        gradient.addColorStop(
          0,
          `${beam.color}${Math.floor(beam.intensity * 255)
            .toString(16)
            .padStart(2, "0")}`,
        );
        gradient.addColorStop(
          0.7,
          `${beam.color}${Math.floor(beam.intensity * 128)
            .toString(16)
            .padStart(2, "0")}`,
        );
        gradient.addColorStop(1, `${beam.color}00`);
      } else {
        // Softer spotlight cone
        gradient.addColorStop(
          0,
          `${beam.color}${Math.floor(beam.intensity * 180)
            .toString(16)
            .padStart(2, "0")}`,
        );
        gradient.addColorStop(
          0.3,
          `${beam.color}${Math.floor(beam.intensity * 100)
            .toString(16)
            .padStart(2, "0")}`,
        );
        gradient.addColorStop(1, `${beam.color}00`);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = beam.width;
      ctx.lineCap = "round";

      // Add glow effect
      ctx.shadowColor = beam.color;
      ctx.shadowBlur = beam.type === "laser" ? beam.width * 2 : beam.width;

      ctx.beginPath();
      ctx.moveTo(beam.x, beam.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Reduce particle generation for subtlety
      if (Math.random() < 0.03) {
        const particleX = beam.x + Math.cos(beam.angle) * Math.random() * length * 0.6;
        const particleY = beam.y + Math.sin(beam.angle) * Math.random() * length * 0.6;

        particles.push({
          x: particleX,
          y: particleY,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: 1,
          color: beam.color,
          size: 0.5 + Math.random() * 1,
        });
      }
    };

    // Update light positions and angles
    const updateLights = () => {
      lightBeams.forEach((beam) => {
        if (beam.type === "moving-head" && beam.targetAngle !== undefined) {
          // Smooth movement towards target
          const angleDiff = beam.targetAngle - beam.angle;
          beam.angle += angleDiff * 0.02;

          // Set new target occasionally
          if (Math.abs(angleDiff) < 0.1 && Math.random() < 0.02) {
            beam.targetAngle = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
          }
        } else {
          // Gentle swaying motion
          beam.angle += Math.sin(time * beam.speed) * 0.01;
        }

        // Intensity pulsing
        beam.intensity = Math.max(0.2, Math.min(1, beam.intensity + (Math.random() - 0.5) * 0.1));

        // Less frequent color changes for subtlety
        if (Math.random() < 0.001) {
          beam.color = lightColors[Math.floor(Math.random() * lightColors.length)];
        }
      });
    };

    // Update and draw particles
    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vy += 0.05; // Gravity

        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark atmospheric background
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016; // ~60fps

      updateLights();

      // Draw all light beams
      lightBeams.forEach(drawBeam);

      // Reset shadow for particles
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      updateParticles();

      animationRef.current = requestAnimationFrame(animate);
    };

    initLights();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        opacity: 0.4,
      }}
    />
  );
}
