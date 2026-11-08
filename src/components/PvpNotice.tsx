interface Props {
  open: boolean
  onClose: () => void
  onPractice: () => void
}

export function PvpNotice({ open, onClose, onPractice }: Props) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="animate-float-in w-full max-w-[340px] rounded-[28px] bg-[var(--cream)] p-5 shadow-2xl">
        <div className="mb-2 text-center text-4xl">😺⚔️🐱</div>
        <h2 className="text-center font-display text-3xl text-[var(--duo)]">真人对决</h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-black/65">
          同房对战需要直播间座位。当前版本先用人机练手，手速热起来再约朋友上擂台。
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-black/8 py-3 text-sm font-bold"
          >
            先看看
          </button>
          <button
            type="button"
            onClick={onPractice}
            className="flex-[1.3] rounded-2xl py-3 text-sm font-black text-white"
            style={{ background: "linear-gradient(105deg, #8b6cff, #5536d4)" }}
          >
            去挑战人机
          </button>
        </div>
      </div>
    </div>
  )
}
