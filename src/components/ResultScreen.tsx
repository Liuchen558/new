import { OBJECT_TYPES, type MatchResult } from "../game/types"
import { ForestBackground } from "./Background"

interface Props {
  result: MatchResult
  onRetry: () => void
  onMenu: () => void
}

export function ResultScreen({ result, onRetry, onMenu }: Props) {
  const won = result.playerScore >= result.aiScore
  const obj = OBJECT_TYPES.find((o) => o.id === result.settings.objectType)
  const stars = won ? (result.playerScore > result.aiScore + 20 ? 3 : result.playerScore > result.aiScore ? 2 : 1) : 0

  return (
    <div className="relative flex h-full flex-col animate-float-in">
      <ForestBackground />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
        <div className="mb-2 text-5xl">{won ? "🏆" : "🐱"}</div>
        <div
          className="mb-4 rounded-2xl px-8 py-2 font-display text-4xl text-[#fff6d8] shadow-xl"
          style={{
            background: won
              ? "linear-gradient(160deg, #f5c542, #d4a020)"
              : "linear-gradient(160deg, #a48bff, #6a4de8)",
          }}
        >
          {won ? "大获全胜" : "惜败"}
        </div>

        <div className="mb-3 flex gap-1 text-2xl">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? "opacity-100" : "opacity-25"}>
              ⭐
            </span>
          ))}
        </div>

        <p className="mb-4 text-xs text-white/80">
          {obj?.name} · {result.difficultyLabel} · 挑战人机
        </p>

        <div className="mb-5 grid w-full max-w-[320px] grid-cols-2 gap-3">
          <ScoreCard
            tone="player"
            label="我"
            score={result.playerScore}
            meta={[
              `${result.maxCombo} 连击`,
              `${(result.durationMs / 1000).toFixed(1)}s`,
              result.reason === "branch" ? "撞枝" : "超时",
            ]}
          />
          <ScoreCard
            tone="ai"
            label="人机"
            score={result.aiScore}
            crown={!won}
            meta={["自动劈砍", `${result.settings.difficulty}`, "刀速"]}
          />
        </div>

        <div className="flex w-full max-w-[320px] gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="flex-1 rounded-2xl bg-[#e8d5b0] py-3.5 text-sm font-bold text-[#5a3a14] shadow"
          >
            回菜单
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="flex-[1.4] rounded-2xl py-3.5 text-sm font-black text-white shadow-lg"
            style={{ background: "linear-gradient(180deg, #6fd45a, #2f8f2c)" }}
          >
            再来一局
          </button>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({
  tone,
  label,
  score,
  meta,
  crown,
}: {
  tone: "player" | "ai"
  label: string
  score: number
  meta: string[]
  crown?: boolean
}) {
  const bg = tone === "player" ? "var(--player)" : "var(--ai)"
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/95 p-3 shadow-lg">
      {crown && <div className="absolute right-2 top-1 text-lg">👑</div>}
      <div
        className="mb-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ background: bg }}
      >
        {label}
      </div>
      <div className="font-display text-4xl leading-none" style={{ color: bg }}>
        {score}
        <span className="ml-1 text-base">节</span>
      </div>
      <div className="mt-2 space-y-0.5 text-[10px] text-black/45">
        {meta.map((m) => (
          <div key={m}>{m}</div>
        ))}
      </div>
    </div>
  )
}
