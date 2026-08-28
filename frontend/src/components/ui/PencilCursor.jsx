// Pencil trail cursor effect with smooth orange ball indicator
// Previously: src/component/mousemovement/MouseMovement.jsx
import { useEffect, useRef } from "react";

export default function PencilCursor() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const history = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;
      pos.current.x += dx * 0.25;
      pos.current.y += dy * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      history.current.push({ x: pos.current.x, y: pos.current.y });
      if (history.current.length > 40) history.current.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (history.current.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(80, 80, 80, 0.6)";
        ctx.moveTo(history.current[0].x, history.current[0].y);
        for (let i = 1; i < history.current.length; i++) {
          ctx.lineTo(history.current[i].x, history.current[i].y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    pos.current.x = mouse.current.x;
    pos.current.y = mouse.current.y;
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />
      <div ref={cursorRef} className="fixed top-0 left-0 z-[9999] h-3 w-3 -ml-1.5 -mt-1.5 rounded-full bg-orange-400 shadow-sm pointer-events-none" />
    </>
  );
}
