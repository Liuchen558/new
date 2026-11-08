import { useEffect, useRef, useState } from "react"
import { chop, createInitialStack, getDifficulty, simulateAiScore } from "../game/engine"
import type { GameSettings, MatchResult, Segment, Side } from "../game/types"
import { ForestBackground } from "./Background"
import { BambooTower } from "./BambooTower"

interface Props {
  settings: GameSettings
  showTutorial: boolean
  onSkipTutorial: () => void
  onEnd: (result: MatchResult) => void
  onBack: () => void
}

export function GameScreen({ settings, showTutorial, onSkipTutorial, onEnd, onBack }: Props) {
  const config = getDifficulty(settings.difficulty)
  const [segments, setSegments] = useState<Segment[]>(() => createInitialStack(config))
  const [side, setSide] = useState<Side>("left")
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1)
  const [chopping, setChopping] = useState(false)
  const [countdown, setCountdown] = useState(showTutorial ? 0 : 3)
  const [hintSide, setHintSide] = useState<Side | null>(null)
  const [tutorialStep, setTutorialStep] = useState(1)
  const startedAt = useRef(Date.now())
  const alive = useRef(true)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const maxComboRef = useRef(0)
  const sideRef = useRef<Side>("left")
  const segmentsRef = useRef(segments)
  const timeRef = useRef(1)

  useEffect(() => {
    segmentsRef.current = segments
  }, [segments])

  // Countdown before play (non-tutorial)
  useEffect(() => {
    if (showTutorial || countdown <= 0) return
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => window.clearTimeout(t)
  }, [countdown, showTutorial])

  // Update hint for tutorial / tip
  useEffect(() => {
    const danger = segments[0]?.branch
    if (danger === "left") setHintSide("right")
    else if (danger === "right") setHintSide("left")
    else setHintSide(null)
  }, [segments])

  // Time drain + AI score tick
  useEffect(() => {
    if (showTutorial || countdown > 0) return
    startedAt.current = Date.now()
    const id = window.setInterval(() => {
      if (!alive.current) return
      const elapsed = Date.now() - startedAt.current
      setAiScore(simulateAiScore(elapsed, config, false))

      timeRef.current = Math.max(0, timeRef.current - config.timeDrain * 0.05)
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        alive.current = false
        finish("timeout")
      }
    }, 50)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTutorial, countdown, settings.difficulty])

  function finish(reason: MatchResult["reason"]) {
    const elapsed = Date.now() - startedAt.current
    const finalAi = simulateAiScore(elapsed, config, true)
    onEnd({
      playerScore: scoreRef.current,
      aiScore: finalAi,
      maxCombo: maxComboRef.current,
      durationMs: elapsed,
      reason,
      settings,
      difficultyLabel: config.label,
    })
  }

  function handleChop(nextSide: Side) {
    if (!alive.current) return
    if (!showTutorial && countdown > 0) return

    const result = chop(
      segmentsRef.current,
      nextSide,
      scoreRef.current,
      comboRef.current,
      config,
    )

    setChopping(true)
    window.setTimeout(() => setChopping(false), 120)

    setSegments(result.segments)
    segmentsRef.current = result.segments
    setSide(result.side)
    sideRef.current = result.side
    setScore(result.score)
    scoreRef.current = result.score
    setCombo(result.combo)
    comboRef.current = result.combo
    if (result.combo > maxComboRef.current) {
      maxComboRef.current = result.combo
      setMaxCombo(result.combo)
    }

    if (result.ok) {
      timeRef.current = Math.min(1, timeRef.current + config.chopBonus)
      setTimeLeft(timeRef.current)
      if (showTutorial) {
        setTutorialStep((s) => Math.min(7, s + 1))
        if (result.score >= 7) {
          alive.current = false
          onSkipTutorial()
          return
        }
      }
    }

    if (result.died) {
      alive.current = false
      if (showTutorial) {
        // Soft reset during tutorial
        const fresh = createInitialStack(config)
        setSegments(fresh)
        segmentsRef.current = fresh
        setSide("left")
        sideRef.current = "left"
        setScore(0)
        scoreRef.current = 0
        setCombo(0)
        comboRef.current = 0
        alive.current = true
        timeRef.current = 1
        setTimeLeft(1)
        return
      }
      finish("branch")
    }
  }

  function onPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    handleChop(x < rect.width / 2 ? "left" : "right")
  }

  const danger = segments[0]?.branch
  const tip =
    tutorialStep === 1
      ? "点屏幕左半边出左刀，点右半边出右刀！"
      : danger === "right"
        ? "竹枝在右边，快点左边！"
        : danger === "left"
          ? "竹枝在左边，快点右边！"
          : "头顶上方的竹枝在哪边就点另一边出刀！"

  return (
    <div className="relative flex h-full flex-col">
      <ForestBackground />

      <div className="relative z-10 flex items-center justify-between px-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-black/30 px-3 py-1 text-sm text-white backdrop-blur"
        >
          ‹ 退出
        </button>
        <div className="flex items-center gap-3">
          <ScorePill tone="player" label="我" value={score} />
          <ScorePill tone="ai" label="人机" value={showTutorial ? 0 : aiScore} />
        </div>
        <div className="w-14 text-right text-xs font-bold text-white/90">
          {combo > 1 ? `${combo}连击` : ""}
        </div>
      </div>

      {/* Time bar */}
      <div className="relative z-10 mx-4 mt-2 h-2.5 overflow-hidden rounded-full bg-black/25">
        <div
          className="h-full rounded-full transition-[width] duration-75"
          style={{
            width: `${Math.max(0, timeLeft) * 100}%`,
            background:
              timeLeft > 0.35
                ? "linear-gradient(90deg, #f5c542, #6fd45a)"
                : "linear-gradient(90deg, #ff6b4a, #e85d2a)",
          }}
        />
      </div>

      {(showTutorial || hintSide) && (
        <div className="relative z-20 mx-4 mt-3 rounded-2xl bg-white/92 px-3 py-2.5 shadow-lg backdrop-blur">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--player)]">
              {showTutorial ? `第${tutorialStep}步 · 新手练习` : "提示"}
            </span>
            {showTutorial && (
              <button type="button" onClick={onSkipTutorial} className="text-xs text-black/45">
                跳过
              </button>
            )}
          </div>
          <p className="text-sm font-bold leading-snug text-[var(--ink)]">{tip}</p>
          {showTutorial && (
            <p className="mt-1 text-[11px] text-black/45">已劈 {Math.min(score, 7)}/7</p>
          )}
        </div>
      )}

      <div className="relative z-10 min-h-0 flex-1 touch-none select-none" onPointerDown={onPointer}>
        {/* Side hints */}
        {hintSide && (
          <>
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 ${hintSide === "left" ? "animate-hint bg-white/10" : ""}`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-1/2 ${hintSide === "right" ? "animate-hint bg-white/10" : ""}`}
            />
            <div
              className="pointer-events-none absolute bottom-28 text-4xl animate-hint"
              style={{ [hintSide === "left" ? "left" : "right"]: "18%" }}
            >
              👆
            </div>
          </>
        )}

        <BambooTower
          segments={segments}
          objectType={settings.objectType}
          playerSide={side}
          chopping={chopping}
        />

        {!showTutorial && countdown > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="animate-score-pop font-display text-8xl text-white drop-shadow-lg">
              {countdown}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 pb-3 text-center text-[11px] text-white/70">
        点左半屏 ← 出刀 → 点右半屏
        {maxCombo > 1 && <span className="ml-2">最高连击 {maxCombo}</span>}
      </div>
    </div>
  )
}

function ScorePill({
  tone,
  label,
  value,
}: {
  tone: "player" | "ai"
  label: string
  value: number
}) {
  const bg = tone === "player" ? "var(--player)" : "var(--ai)"
  return (
    <div
      className="flex min-w-16 items-center justify-center gap-1 rounded-full px-2.5 py-1 text-white shadow"
      style={{ background: bg }}
    >
      <span className="text-[10px] opacity-90">{label}</span>
      <span className="text-sm font-black tabular-nums">{value}</span>
    </div>
  )
}
