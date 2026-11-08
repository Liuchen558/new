interface Props {
  title?: string
}

export function PhoneChrome({ title = "哈哈哈哈哈哈" }: Props) {
  return (
    <div className="relative z-20 shrink-0">
      <div className="flex items-center justify-between px-4 pb-1 pt-2 text-[11px] font-medium text-white/90">
        <span>14:47</span>
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter">●●●●</span>
          <span>Wi‑Fi</span>
          <span className="rounded-sm bg-white/90 px-1 text-[10px] text-[var(--bamboo-deep)]">73%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <button type="button" className="text-xl leading-none text-white/90" aria-label="返回">
          ‹
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-white">{title}</div>
          <div className="text-[10px] text-white/70">热度: 10 · 房间号: 10369660</div>
        </div>
        <span className="rounded-full bg-[#f5c542] px-2.5 py-1 text-[11px] font-bold text-[#5a3a00]">
          趣味玩法 ▾
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 pb-2 text-[11px]">
        <span className="rounded-full bg-[#3dba6a] px-2 py-0.5 font-medium text-white">找人玩</span>
        <span className="text-white/80">公告</span>
        <span className="text-white/80">选择音乐</span>
        <span className="ml-auto text-white/70">虚位以待 › 1</span>
      </div>
      <div className="flex gap-2 overflow-hidden px-3 pb-2">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--player)] shadow-md ring-2 ring-white/40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 shrink-0 rounded-full border border-white/35 bg-white/15"
          />
        ))}
      </div>
    </div>
  )
}

export function BottomDock() {
  return (
    <div className="relative z-20 flex items-end justify-center gap-4 pb-3 pt-1">
      <div className="h-10 w-10 rounded-full bg-white/75 shadow" />
      <div className="h-10 w-10 rounded-full bg-white/55 shadow" />
      <div className="flex h-11 min-w-20 items-center justify-center rounded-full bg-[#f5c542] px-4 text-sm font-bold text-[#5a3a00] shadow-lg">
        选择
      </div>
      <div className="h-10 w-10 rounded-full bg-white/55 shadow" />
      <div className="h-10 w-10 rounded-xl bg-[#e85d7a]/90 shadow" />
    </div>
  )
}
