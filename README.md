# 节节高 · 手速擂台

Original Claude artifact game, packaged to run locally.

Tap the left or right half of the screen to chop bamboo. Avoid branches, race the AI, climb your score — 节节高.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4729 — the page is an **互动房** shell (top seats / bottom chat) wrapping the original game; on a real phone it goes full screen.

```bash
npm run build
npm run preview
```

## Contents

- `static-game/index.html` — interactive-room host chrome (covers the game’s top/bottom safe insets)
- `static-game/game.html` — original artifact HTML (unchanged game)
- `static-game/assets/main.js` + `art/` — original bundle and sprites
- Vite is only used as a static file server / bundler for hosting

Source artifact: https://claude.ai/artifact/Ky6sFgmwkpWBZetBtJYT2P
