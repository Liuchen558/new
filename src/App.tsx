import { useCallback, useState } from "react"
import { BottomDock, PhoneChrome } from "./components/PhoneChrome"
import { MainMenu } from "./components/MainMenu"
import { SetupScreen } from "./components/SetupScreen"
import { GameScreen } from "./components/GameScreen"
import { ResultScreen } from "./components/ResultScreen"
import { RulesModal } from "./components/RulesModal"
import { PvpNotice } from "./components/PvpNotice"
import type { GameSettings, MatchResult, ObjectType, Screen } from "./game/types"

const defaultSettings: GameSettings = {
  mode: "ai",
  objectType: "bamboo",
  difficulty: 40,
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu")
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [pvpOpen, setPvpOpen] = useState(false)
  const [tutorial, setTutorial] = useState(() => {
    try {
      return localStorage.getItem("jjg-tutorial-done") !== "1"
    } catch {
      return true
    }
  })
  const [playKey, setPlayKey] = useState(0)

  const markTutorialDone = useCallback(() => {
    setTutorial(false)
    try {
      localStorage.setItem("jjg-tutorial-done", "1")
    } catch {
      /* ignore */
    }
  }, [])

  const startPlay = useCallback((withTutorial: boolean) => {
    setTutorial(withTutorial)
    setPlayKey((k) => k + 1)
    setScreen("play")
  }, [])

  return (
    <div className="flex h-full items-center justify-center p-0 sm:p-4">
      <div
        className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden sm:h-[min(860px,100%)] sm:rounded-[32px] sm:shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #1a5c3a 0%, #0f3d28 100%)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
        }}
      >
        <PhoneChrome />

        <main className="relative min-h-0 flex-1 overflow-hidden rounded-t-[24px] bg-[var(--bamboo-mid)]">
          {screen === "menu" && (
            <MainMenu
              onChallengeAi={() => {
                setSettings((s) => ({ ...s, mode: "ai" }))
                setScreen("setup")
              }}
              onPvp={() => setPvpOpen(true)}
              onRules={() => setRulesOpen(true)}
            />
          )}

          {screen === "setup" && (
            <SetupScreen
              objectType={settings.objectType}
              difficulty={settings.difficulty}
              onObjectType={(objectType: ObjectType) =>
                setSettings((s) => ({ ...s, objectType }))
              }
              onDifficulty={(difficulty) => setSettings((s) => ({ ...s, difficulty }))}
              onStart={() => startPlay(tutorial)}
              onBack={() => setScreen("menu")}
              onRules={() => setRulesOpen(true)}
            />
          )}

          {screen === "play" && (
            <GameScreen
              key={playKey}
              settings={settings}
              showTutorial={tutorial}
              onSkipTutorial={() => {
                markTutorialDone()
                setPlayKey((k) => k + 1)
              }}
              onEnd={(r) => {
                setResult(r)
                setScreen("result")
              }}
              onBack={() => setScreen("setup")}
            />
          )}

          {screen === "result" && result && (
            <ResultScreen
              result={result}
              onRetry={() => startPlay(false)}
              onMenu={() => setScreen("menu")}
            />
          )}

          <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
          <PvpNotice
            open={pvpOpen}
            onClose={() => setPvpOpen(false)}
            onPractice={() => {
              setPvpOpen(false)
              setSettings((s) => ({ ...s, mode: "ai" }))
              setScreen("setup")
            }}
          />
        </main>

        {screen === "menu" && <BottomDock />}
      </div>
    </div>
  )
}
