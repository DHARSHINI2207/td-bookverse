import { motion } from "framer-motion";

/**
 * A hand-built illustration of stacked, slightly-fanned books with one
 * floating open book above — the hero's single bold visual moment.
 */
export function BookStack() {
  const spines = [
    { color: "#F9A8D4", w: 190, rot: -3 },
    { color: "#C4B5FD", w: 210, rot: 2 },
    { color: "#FBCFE8", w: 175, rot: -1.5 },
    { color: "#A855F7", w: 200, rot: 1 },
  ];

  return (
    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      {/* stacked books */}
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center">
        {spines.map((s, i) => (
          <div
            key={i}
            style={{
              width: s.w,
              transform: `rotate(${s.rot}deg)`,
              backgroundColor: s.color,
            }}
            className="h-9 rounded-[4px] shadow-md -mt-1 first:mt-0"
          />
        ))}
      </div>

      {/* floating open book */}
      <motion.div
        style={{ ["--rot" as string]: "-4deg" }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-2 -translate-x-1/2"
      >
        <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M75 14 L10 24 V96 L75 88 Z" fill="#FFF9FC" stroke="#A855F7" strokeOpacity="0.12" />
          <path d="M75 14 L140 24 V96 L75 88 Z" fill="#FFFFFF" stroke="#A855F7" strokeOpacity="0.12" />
          {[30, 40, 50, 60, 70].map((y) => (
            <line key={`l-${y}`} x1="20" y1={y} x2="65" y2={y - 4} stroke="#A855F7" strokeOpacity="0.15" strokeWidth="2" />
          ))}
          {[30, 40, 50, 60, 70].map((y) => (
            <line key={`r-${y}`} x1="85" y1={y - 4} x2="130" y2={y} stroke="#A855F7" strokeOpacity="0.15" strokeWidth="2" />
          ))}
          <path d="M75 14 V88" stroke="#EC4899" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* soft glow */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-rose/25 via-lavender/20 to-transparent blur-3xl" />
    </div>
  );
}
