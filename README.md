# 节节高 · 手速擂台

A Timberman-style bamboo chopping mini-game recreated from a Claude artifact. Tap the left or right half of the screen to chop — dodge branches, race the AI, and climb the scoreboard one节 at a time.

## Play

- **挑战人机** — pick a tower skin and difficulty, then chop against a bot
- **真人对决** — placeholder for room duels; routes you to AI practice for now
- **玩法** — rules overlay

### Controls

- Tap / click **left half** → chop from the left
- Tap / click **right half** → chop from the right
- If the next segment has a branch on your side, chop the **other** side or you lose
- Keep the energy bar from emptying by chopping steadily

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://127.0.0.1:4729`).

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Tailwind CSS v4
