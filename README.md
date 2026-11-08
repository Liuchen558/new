# 节节高 · 手速擂台

Original Claude artifact game, packaged to run locally.

Tap the left or right half of the screen to chop bamboo. Avoid branches, race the AI, climb your score — 节节高.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4729 — desktop shows a phone-sized frame (390×844); on a real phone it goes full screen.

```bash
npm run build
npm run preview
```

## Contents

- `static-game/index.html` — phone frame shell
- `static-game/game.html` — original artifact HTML (unchanged game)
- `static-game/assets/main.js` + `art/` — original bundle and sprites
- Vite is only used as a static file server / bundler for hosting

Source artifact: https://claude.ai/artifact/Ky6sFgmwkpWBZetBtJYT2P
