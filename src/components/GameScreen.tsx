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
  const [started, setStarted] = useState(false)

  const startedAt = useRef(0)
  const alive = useRef(true)
  const ended = useRef(false)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const maxComboRef = useRef(0)
  const segmentsRef = useRef(segments)
  const timeRef = useRef(1)
  const startedRef = useRef(false)
  const onEndRef = useRef(onEnd)
  const configRef = useRef(config)

  useEffect(() => {
    segmentsRef.current = segments
  }, [segments])

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    configRef.current = config
  }, [config])

  // Countdown before play (non-tutorial)
  useEffect(() => {
    if (showTutorial || countdown <= 0) return
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => window.clearTimeout(t)
  }, [countdown, showTutorial])

  // Hint which side to tap when the next segment has a branch
  useEffect(() => {
    const danger = segments[0]?.branch
    if (danger === "left") setHintSide("right")
    else if (danger === "right") setHintSide("left")
    else setHintSide(null)
  }, [segments])

  // Energy drain + AI score — only after the player’s first chop
  useEffect(() => {
    if (showTutorial || countdown > 0 || !started) return

    const id = window.setInterval(() => {
      if (!alive.current || ended.current) return
      const cfg = configRef.current
      const elapsed = Date.now() - startedAt.current
      setAiScore(simulateAiScore(elapsed, cfg, false))

      timeRef.current = Math.max(0, timeRef.current - cfg.timeDrainPerSec * 0.05)
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        finish("timeout")
      }
    }, 50)

    return () => window.clearInterval(id)
  }, [showTutorial, countdown, started, settings.difficulty])

  function finish(reason: MatchResult["reason"]) {
    if (ended.current) return
    ended.current = true
    alive.current = false
    const cfg = configRef.current
    const elapsed = startedAt.current ? Date.now() - startedAt.current : 0
    const finalAi = simulateAiScore(elapsed, cfg, true)
    onEndRef.current({
      playerScore: scoreRef.current,
      aiScore: finalAi,
      maxCombo: maxComboRef.current,
      durationMs: elapsed,
      reason,
      settings,
      difficultyLabel: cfg.label,
    })
  }

  function beginRun() {
    if (startedRef.current) return
    startedRef.current = true
    startedAt.current = Date.now()
    setStarted(true)
  }

  function handleChop(nextSide: Side) {
    if (!alive.current || ended.current) return
    if (!showTutorial && countdown > 0) return

    const result = chop(
      segmentsRef.current,
      nextSide,
      scoreRef.current,
      comboRef.current,
      configRef.current,
    )

    if (result.ok || result.died) {
      beginRun()
    }

    setChopping(true)
    window.setTimeout(() => setChopping(false), 120)

    setSegments(result.segments)
    segmentsRef.current = result.segments
    setSide(result.side)
    setScore(result.score)
    scoreRef.current = result.score
    setCombo(result.combo)
    comboRef.current = result.combo
    if (result.combo > maxComboRef.current) {
      maxComboRef.current = result.combo
      setMaxCombo(result.combo)
    }

    if (result.ok) {
      timeRef.current = Math.min(1, timeRef.current + configRef.current.chopBonus)
      setTimeLeft(timeRef.current)
      if (showTutorial) {
        setTutorialStep((s) => Math.min(7, s + 1))
        if (result.score >= 7) {
          onSkipTutorial()
          return
        }
      }
    }

    if (result.died) {
      if (showTutorial) {
        const fresh = createInitialStack(configRef.current)
        setSegments(fresh)
        segmentsRef.current = fresh
        setSide("left")
        setScore(0)
        scoreRef.current = 0
        setCombo(0)
        comboRef.current = 0
        alive.current = true
        ended.current = false
        timeRef.current = 1
        setTimeLeft(1)
        startedRef.current = false
        setStarted(false)
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

  const waitingToStart = !showTutorial && countdown <= 0 && !started

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

      {(showTutorial || (hintSide && started)) && (
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
        {hintSide && started && (
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
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="animate-score-pop font-display text-8xl text-white drop-shadow-lg">
              {countdown}
            </div>
          </div>
        )}

        {waitingToStart && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 text-center">
            <span className="rounded-full bg-black/35 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              点左或右半屏开始劈砍
            </span>
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
