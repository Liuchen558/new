interface Props {
  open: boolean
  onClose: () => void
}

export function RulesModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="animate-float-in w-full max-w-[360px] rounded-[28px] bg-[var(--cream)] p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-3xl text-[var(--bamboo-mid)]">玩法说明</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/8 text-lg"
          >
            ×
          </button>
        </div>

        <ol className="space-y-3 text-sm leading-relaxed text-[var(--ink)]">
          <li>
            <strong className="text-[var(--player)]">1. 左右出刀</strong>
            <p className="text-black/65">点屏幕左半边在左侧劈砍，点右半边在右侧劈砍。</p>
          </li>
          <li>
            <strong className="text-[var(--player)]">2. 躲开竹枝</strong>
            <p className="text-black/65">
              头顶下一节若有竹枝，必须点<strong>另一边</strong>出刀，否则会被砸到。
            </p>
          </li>
          <li>
            <strong className="text-[var(--player)]">3. 抢时间</strong>
            <p className="text-black/65">顶部能量条会不断下降，每劈一节可回一点；空了就结束。</p>
          </li>
          <li>
            <strong className="text-[var(--player)]">4. 挑战人机</strong>
            <p className="text-black/65">人机会按难度自动劈砍，比一比谁劈的节数更多。</p>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl py-3 font-bold text-white"
          style={{ background: "linear-gradient(180deg, #6fd45a, #2f8f2c)" }}
        >
          知道了
        </button>
      </div>
    </div>
  )
}
