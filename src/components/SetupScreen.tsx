import { OBJECT_TYPES, getDifficulty, type ObjectType } from "../game/types"
import { ForestBackground } from "./Background"

interface Props {
  objectType: ObjectType
  difficulty: number
  onObjectType: (t: ObjectType) => void
  onDifficulty: (v: number) => void
  onStart: () => void
  onBack: () => void
  onRules: () => void
}

export function SetupScreen({
  objectType,
  difficulty,
  onObjectType,
  onDifficulty,
  onStart,
  onBack,
  onRules,
}: Props) {
  const cfg = getDifficulty(difficulty)

  return (
    <div className="relative flex h-full flex-col animate-float-in">
      <ForestBackground />

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-4 pt-2">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-black/25 px-3 py-1 text-sm font-medium text-white backdrop-blur"
          >
            ‹ 返回
          </button>
          <div
            className="rounded-xl px-5 py-1.5 font-display text-2xl text-[#fff6d8] shadow"
            style={{ background: "linear-gradient(160deg, #d4a574, #9a6f38)" }}
          >
            挑战人机
          </div>
          <button
            type="button"
            onClick={onRules}
            className="flex h-11 w-11 flex-col items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-[var(--bamboo-mid)] shadow"
          >
            <span className="text-base">？</span>
            玩法
          </button>
        </div>

        <div className="mx-auto mb-2 text-5xl">🐱</div>

        <div className="flex-1 space-y-3 overflow-auto rounded-[28px] bg-[var(--cream)]/95 p-4 shadow-xl backdrop-blur">
          <section>
            <h2 className="mb-2 text-sm font-bold text-[var(--ink)]">劈什么</h2>
            <div className="grid grid-cols-4 gap-2">
              {OBJECT_TYPES.map((item) => {
                const selected = item.id === objectType
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onObjectType(item.id)}
                    className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2.5 transition ${
                      selected
                        ? "border-[var(--player)] bg-[#fff0e6] shadow-md"
                        : "border-transparent bg-white/70"
                    }`}
                  >
                    {selected && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bamboo-leaf)] text-[10px] font-bold text-white">
                        ✓
                      </span>
                    )}
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[11px] font-bold">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-end justify-between">
              <h2 className="text-sm font-bold">难度</h2>
              <div className="text-right">
                <span className="text-lg font-black text-[var(--player)]">{cfg.label}</span>
                <span className="ml-2 text-sm text-black/45">{cfg.value}</span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={difficulty}
              onChange={(e) => onDifficulty(Number(e.target.value))}
              className="mb-2 w-full accent-[var(--player)]"
            />
            <div className="mb-3 flex justify-between text-[10px] text-black/45">
              <span>轻松</span>
              <span>正常</span>
              <span>紧张</span>
              <span>极限</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Stat icon="🚩" label="竹枝密度" value={`${Math.round(cfg.branchDensity * 100)}%`} />
              <Stat icon="⇄" label="换边" value={`${Math.round(cfg.sideSwap * 100)}%`} />
              <Stat icon="⭐" label="撞击窗口" value={`${cfg.hitWindow.toFixed(1)}s`} />
              <Stat icon="🤖" label="人机刀/秒" value={cfg.aiKnivesPerSec.toFixed(1)} />
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-3 w-full rounded-2xl py-3.5 text-lg font-black text-white shadow-lg transition active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #6fd45a 0%, #3daa38 55%, #2f8f2c 100%)",
          }}
        >
          开始游戏
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-2.5 py-2">
      <span className="text-base">{icon}</span>
      <div>
        <div className="font-bold text-[var(--ink)]">{value}</div>
        <div className="text-[10px] text-black/45">{label}</div>
      </div>
    </div>
  )
}
