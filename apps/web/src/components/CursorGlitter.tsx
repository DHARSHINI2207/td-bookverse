import { useEffect, useRef } from "react";

export function CursorGlitter() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let last = 0;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      if (now - last < 34) return;
      last = now;

      const sparkle = document.createElement("span");
      sparkle.className = "cursor-sparkle";
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      sparkle.style.setProperty("--sparkle-delay", `${Math.random() * 80}ms`);
      sparkle.style.setProperty("--sparkle-size", `${2 + Math.random() * 4}px`);
      sparkle.style.setProperty("--sparkle-hue", `${320 + Math.random() * 45}`);
      layer.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 900);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true" />;
}
