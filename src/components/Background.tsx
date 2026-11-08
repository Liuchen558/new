export function ForestBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, #87c4a8 0%, #6bb88a 28%, #4a9a62 58%, #2f7a48 100%)
          `,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[42%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(255,255,220,0.45), transparent 70%)",
        }}
      />
      {/* Distant mountains */}
      <svg className="absolute inset-x-0 top-[18%] w-full opacity-50" viewBox="0 0 390 120" preserveAspectRatio="none">
        <path d="M0 120 L40 70 L90 95 L140 45 L200 85 L260 40 L320 75 L390 55 L390 120 Z" fill="#3d6b55" />
        <path d="M0 120 L60 85 L120 100 L180 65 L250 95 L310 60 L390 80 L390 120 Z" fill="#2f5a45" />
      </svg>
      {/* Soft bamboo silhouettes */}
      {[40, 90, 300, 350].map((x, i) => (
        <div
          key={x}
          className="absolute bottom-[18%] w-3 rounded-full opacity-35"
          style={{
            left: x,
            height: `${180 + i * 30}px`,
            background: "linear-gradient(180deg, #2d6b40, #1a4a2c)",
          }}
        />
      ))}
      {/* Ground */}
      <div
        className="absolute inset-x-0 bottom-0 h-[22%]"
        style={{
          background: "linear-gradient(180deg, #5fa83a 0%, #3d7a28 55%, #2a5a1c 100%)",
        }}
      />
      <div className="absolute bottom-[18%] left-[8%] h-3 w-10 rounded-full bg-[#c46b3a]/80" />
      <div className="absolute bottom-[16%] right-[14%] h-2.5 w-8 rounded-full bg-white/80" />
      <div className="absolute bottom-[20%] left-[28%] h-2 w-6 rounded-full bg-[#e8a0c0]/70" />
      {/* Floating leaves */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute text-lg opacity-60"
          style={{
            left: `${18 + i * 28}%`,
            top: `${30 + i * 8}%`,
            animation: `leaf-drift ${3.5 + i}s linear ${i * 0.8}s infinite`,
          }}
        >
          🍃
        </span>
      ))}
    </div>
  )
}
