import {
  type Branch,
  type DifficultyConfig,
  type Segment,
  type Side,
  getDifficulty,
} from "./types"

let nextId = 1

function randomBranch(density: number, preferOppositeOf: Branch): Branch {
  if (Math.random() > density) return "none"
  if (preferOppositeOf === "left") return Math.random() < 0.7 ? "right" : "left"
  if (preferOppositeOf === "right") return Math.random() < 0.7 ? "left" : "right"
  return Math.random() < 0.5 ? "left" : "right"
}

export function createSegment(branch: Branch = "none"): Segment {
  return { id: nextId++, branch }
}

export function createInitialStack(config: DifficultyConfig, count = 12): Segment[] {
  const stack: Segment[] = []
  let prev: Branch = "none"
  for (let i = 0; i < count; i++) {
    // Keep the first few segments clear so the opening chops are always safe
    const branch: Branch =
      i < 4 ? "none" : randomBranch(config.branchDensity * (i < 6 ? 0.55 : 1), prev)
    stack.push(createSegment(branch))
    if (branch !== "none") prev = branch
  }
  return stack
}

export interface ChopResult {
  ok: boolean
  died: boolean
  reason?: "branch"
  segments: Segment[]
  side: Side
  score: number
  combo: number
}

export function chop(
  segments: Segment[],
  side: Side,
  score: number,
  combo: number,
  config: DifficultyConfig,
): ChopResult {
  const current = segments[0]
  if (!current) {
    return { ok: false, died: true, reason: "branch", segments, side, score, combo: 0 }
  }

  // Chopping into a branch on your side = death (score does not count this swing)
  if (current.branch === side) {
    return {
      ok: false,
      died: true,
      reason: "branch",
      segments,
      side,
      score,
      combo: 0,
    }
  }

  const next = segments.slice(1)
  const last = next[next.length - 1]
  const preferOpposite = Math.random() < config.sideSwap
  const prefer: Branch = preferOpposite ? (side === "left" ? "right" : "left") : last?.branch ?? "none"
  next.push(createSegment(randomBranch(config.branchDensity, prefer)))

  const newScore = score + 1
  const newCombo = combo + 1

  // After the tree drops, a branch on your standing side is fatal
  if (next[0]?.branch === side) {
    return {
      ok: true,
      died: true,
      reason: "branch",
      segments: next,
      side,
      score: newScore,
      combo: newCombo,
    }
  }

  return {
    ok: true,
    died: false,
    segments: next,
    side,
    score: newScore,
    combo: newCombo,
  }
}

export function simulateAiScore(
  elapsedMs: number,
  config: DifficultyConfig,
  playerDied: boolean,
): number {
  const chops = (elapsedMs / 1000) * config.aiKnivesPerSec
  const efficiency = playerDied ? 0.92 : 0.88
  return Math.max(0, Math.floor(chops * efficiency))
}

export { getDifficulty }
