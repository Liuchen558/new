import { OBJECT_TYPES, type ObjectType, type Segment, type Side } from "../game/types"

interface Props {
  segments: Segment[]
  objectType: ObjectType
  playerSide: Side
  chopping: boolean
  visibleCount?: number
}

export function BambooTower({
  segments,
  objectType,
  playerSide,
  chopping,
  visibleCount = 8,
}: Props) {
  const skin = OBJECT_TYPES.find((o) => o.id === objectType) ?? OBJECT_TYPES[0]
  const [c0, c1, c2] = skin.colors
  const visible = segments.slice(0, visibleCount)

  return (
    <div className={`relative mx-auto flex h-full w-full max-w-[280px] flex-col-reverse items-center ${chopping ? "animate-chop" : ""}`}>
      {/* Character */}
      <div
        className="absolute bottom-2 z-20 transition-all duration-100"
        style={{
          left: playerSide === "left" ? "18%" : "58%",
        }}
      >
        <CatWarrior chopping={chopping} facing={playerSide === "left" ? "right" : "left"} />
      </div>

      {/* Stalk */}
      <div className="relative z-10 mb-14 flex w-[56px] flex-col-reverse">
        {visible.map((seg, index) => (
          <SegmentBlock
            key={seg.id}
            branch={seg.branch}
            colors={[c0, c1, c2]}
            isBase={index === 0}
            objectType={objectType}
          />
        ))}
      </div>
    </div>
  )
}

function SegmentBlock({
  branch,
  colors,
  isBase,
  objectType,
}: {
  branch: Segment["branch"]
  colors: [string, string, string]
  isBase: boolean
  objectType: ObjectType
}) {
  const [c0, c1, c2] = colors
  return (
    <div className="relative h-14 w-full">
      <div
        className="absolute inset-x-0 inset-y-0 rounded-[6px]"
        style={{
          background: `linear-gradient(90deg, ${c2}, ${c0} 35%, ${c1} 65%, ${c2})`,
          boxShadow: isBase ? "0 4px 10px rgba(0,0,0,0.25)" : undefined,
        }}
      />
      <div className="absolute inset-x-1 top-0 h-[3px] rounded-full" style={{ background: c2 }} />
      {branch !== "none" && (
        <Branch limb={branch} color={c2} objectType={objectType} />
      )}
    </div>
  )
}

function Branch({
  limb,
  color,
  objectType,
}: {
  limb: Side
  color: string
  objectType: ObjectType
}) {
  const isLeft = limb === "left"
  const leaf =
    objectType === "ice" ? "❄️" : objectType === "pagoda" ? "🏯" : objectType === "cake" ? "🍒" : "🌿"

  return (
    <div
      className="absolute top-3 z-10 flex items-center"
      style={{
        [isLeft ? "right" : "left"]: "100%",
        flexDirection: isLeft ? "row-reverse" : "row",
      }}
    >
      <div
        className="h-3 w-14 rounded-full"
        style={{
          background: `linear-gradient(${isLeft ? "270deg" : "90deg"}, ${color}, ${color}aa)`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
      <span className="-mt-1 text-sm drop-shadow">{leaf}</span>
    </div>
  )
}

function CatWarrior({ chopping, facing }: { chopping: boolean; facing: "left" | "right" }) {
  return (
    <div
      className="relative select-none text-center transition-transform duration-100"
      style={{
        transform: `scaleX(${facing === "left" ? -1 : 1}) ${chopping ? "rotate(-12deg)" : ""}`,
      }}
    >
      <div className="text-[42px] leading-none drop-shadow-md">🐱</div>
      <div className="absolute -right-1 top-3 text-lg">{chopping ? "⚔️" : "🪓"}</div>
      <div className="mx-auto -mt-1 h-2 w-8 rounded-full bg-black/20 blur-[1px]" />
    </div>
  )
}
