# 节节高

Original Claude artifact, restored byte-for-byte from the artifact CDN:

https://claude.ai/artifact/Ky6sFgmwkpWBZetBtJYT2P

- `static-game/index.html` — original 互动房 demo shell (phone frame + top/bottom room chrome)
- `static-game/game.html` — original game page (`节节高 · 试玩`)
- `static-game/assets/main.js` — original bundle
- `static-game/art/` — original art assets

Only Claude’s sandbox `frame-runtime` injection was removed so it can run outside claude.ai. Author HTML/CSS/JS/art are unchanged.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4729

```bash
npm run build
npm run preview
```
