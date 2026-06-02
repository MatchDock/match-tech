import { useEffect, useRef } from "react";

type ParticleType = "square" | "triangle" | "cross";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: ParticleType;
}

const COLORS = ["#B8FF29", "#FF2E93", "#00E5FF", "#FFE600", "#1A1A1A"];

function drawSquare(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeRect(-size / 2, -size / 2, size, size);
}

function drawTriangle(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(size / 2, size / 2);
  ctx.lineTo(-size / 2, size / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawCross(ctx: CanvasRenderingContext2D, size: number) {
  const ts = size / 3;
  ctx.beginPath();
  ctx.moveTo(-ts, -size / 2); ctx.lineTo(ts, -size / 2); ctx.lineTo(ts, -ts);
  ctx.lineTo(size / 2, -ts); ctx.lineTo(size / 2, ts); ctx.lineTo(ts, ts);
  ctx.lineTo(ts, size / 2); ctx.lineTo(-ts, size / 2); ctx.lineTo(-ts, ts);
  ctx.lineTo(-size / 2, ts); ctx.lineTo(-size / 2, -ts); ctx.lineTo(-ts, -ts);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function NeoParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = Math.min(width / 30, 40);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 20 + 10,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        type: (Math.random() > 0.6 ? "square" : Math.random() > 0.5 ? "triangle" : "cross") as ParticleType,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < -p.size)        p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;
        if (p.y < -p.size)         p.y = height + p.size;
        if (p.y > height + p.size) p.y = -p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        if (p.type === "square")   drawSquare(ctx, p.size);
        if (p.type === "triangle") drawTriangle(ctx, p.size);
        if (p.type === "cross")    drawCross(ctx, p.size);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
    />
  );
}
