export type Side = "left" | "right"
export type Branch = "none" | Side
export type Screen = "menu" | "setup" | "play" | "result"
export type Mode = "ai" | "pvp"
export type ObjectType = "bamboo" | "ice" | "pagoda" | "cake"

export interface Segment {
  id: number
  branch: Branch
}

export interface DifficultyConfig {
  label: string
  value: number
  branchDensity: number
  sideSwap: number
  hitWindow: number
  aiKnivesPerSec: number
  /** Fraction of the energy bar drained per second while playing */
  timeDrainPerSec: number
  /** Fraction restored on each successful chop */
  chopBonus: number
}

export interface GameSettings {
  mode: Mode
  objectType: ObjectType
  difficulty: number
}

export interface MatchResult {
  playerScore: number
  aiScore: number
  maxCombo: number
  durationMs: number
  reason: "branch" | "timeout"
  settings: GameSettings
  difficultyLabel: string
}

export const OBJECT_TYPES: {
  id: ObjectType
  name: string
  emoji: string
  colors: [string, string, string]
}[] = [
  { id: "bamboo", name: "青竹", emoji: "🎋", colors: ["#7ec850", "#5fb83a", "#3d7a28"] },
  { id: "ice", name: "冰柱", emoji: "🧊", colors: ["#9ad8ff", "#5eb8ef", "#2f7fbf"] },
  { id: "pagoda", name: "千层塔", emoji: "🏯", colors: ["#d4a574", "#b07848", "#7a4c28"] },
  { id: "cake", name: "蛋糕塔", emoji: "🍰", colors: ["#ffd4e0", "#f5a0b8", "#d4688a"] },
]

export function getDifficulty(value: number): DifficultyConfig {
  const t = Math.min(100, Math.max(0, value)) / 100
  const labels =
    t < 0.28 ? "轻松" : t < 0.55 ? "正常" : t < 0.78 ? "紧张" : "极限"

  return {
    label: labels,
    value: Math.round(t * 100),
    branchDensity: 0.28 + t * 0.42,
    sideSwap: 0.25 + t * 0.5,
    hitWindow: 0.95 - t * 0.45,
    aiKnivesPerSec: 2.2 + t * 5.2,
    // Idle survival ~12s (easy) → ~6s (hard) without chopping
    timeDrainPerSec: 0.08 + t * 0.08,
    // Each chop restores a solid chunk so steady play stays alive
    chopBonus: 0.22 - t * 0.06,
  }
}
