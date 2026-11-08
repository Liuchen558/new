import type { ReactNode } from "react"
import { ForestBackground } from "./Background"

interface Props {
  onChallengeAi: () => void
  onPvp: () => void
  onRules: () => void
}

export function MainMenu({ onChallengeAi, onPvp, onRules }: Props) {
  return (
    <div className="relative flex h-full flex-col animate-float-in">
      <ForestBackground />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-6 pt-4">
        {/* Wooden sign */}
        <div className="relative mb-8 w-full max-w-[280px]">
          <div className="absolute -left-1 top-0 h-16 w-2.5 rounded-full bg-[#6b8f3a]" />
          <div className="absolute -right-1 top-0 h-16 w-2.5 rounded-full bg-[#6b8f3a]" />
          <div
            className="relative mx-3 overflow-hidden rounded-2xl px-4 py-5 text-center shadow-xl"
            style={{
              background: "linear-gradient(160deg, #d4a574 0%, #b8894e 45%, #9a6f38 100%)",
              boxShadow: "0 12px 28px rgba(40,20,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <div className="text-[11px] font-bold tracking-[0.35em] text-[#5a3a14]/80">
              ··· 手速擂台 ···
            </div>
            <h1 className="font-display mt-1 text-5xl leading-none text-[#fff6d8] drop-shadow-[0_3px_0_rgba(90,50,10,0.45)]">
              节节高
            </h1>
            <p className="mt-2 text-xs text-[#5a3a14]/85">点左点右，劈竹节节高</p>
          </div>

          <button
            type="button"
            onClick={onRules}
            className="absolute -right-2 top-1/2 flex h-14 w-14 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white/90 text-[11px] font-bold text-[var(--bamboo-mid)] shadow-lg ring-2 ring-white/60"
          >
            <span className="text-lg">？</span>
            玩法
          </button>
        </div>

        <div className="flex w-full max-w-[320px] flex-col gap-3">
          <ModeButton
            tone="purple"
            title="挑战人机"
            subtitle="一个人练手，难度越高人机越快"
            icon={<AiIcon />}
            onClick={onChallengeAi}
          />
          <ModeButton
            tone="blue"
            title="真人对决"
            subtitle="你当播主摆擂台，房里的朋友入座和你比"
            icon={<PvpIcon />}
            onClick={onPvp}
          />
        </div>
      </div>
    </div>
  )
}

function ModeButton({
  tone,
  title,
  subtitle,
  icon,
  onClick,
}: {
  tone: "purple" | "blue"
  title: string
  subtitle: string
  icon: ReactNode
  onClick: () => void
}) {
  const bg =
    tone === "purple"
      ? "linear-gradient(105deg, #8b6cff 0%, #6a4de8 55%, #5536d4 100%)"
      : "linear-gradient(105deg, #4d9dff 0%, #2f7fff 55%, #1a68e8 100%)"

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white shadow-lg transition active:scale-[0.98]"
      style={{ background: bg }}
    >
      <div className="flex h-12 w-14 shrink-0 items-center justify-center">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-lg font-black tracking-wide">{title}</div>
        <div className="mt-0.5 text-[11px] leading-snug text-white/85">{subtitle}</div>
      </div>
      <span className="text-xl opacity-80 transition group-hover:translate-x-0.5">›</span>
    </button>
  )
}

function AiIcon() {
  return (
    <div className="relative flex items-end gap-0.5 text-2xl">
      <span>🐱</span>
      <span className="text-xl">⚔️</span>
      <span>🤖</span>
    </div>
  )
}

function PvpIcon() {
  return (
    <div className="relative flex items-end gap-0.5 text-2xl">
      <span>🐱</span>
      <span className="text-xl">⚔️</span>
      <span>😺</span>
    </div>
  )
}
