<div align="center">
  <br/>
  <p>
    <img src="frontend/src/assets/Favicon.png" title="SolveSudoku" alt="SolveSudoku logo" width="100" />
  </p>

  <h1>𝑆𝑢𝑑𝑜𝑘𝑢</h1>
  <p>A full‑stack Sudoku solver, scanner, and generator</p>

  <p>
    🌐 <a href="https://marqed.it/Sudoku">Visit us & learn more</a>  
  </p>
  <p>
    🎮 <a href="https://sudoku.marqed.it/">Play</a>
  </p>
  <br/>
</div>
<div align="center">
  Upload a puzzle or perhaps generate one. If you're stuck get some hints or have us solve the puzzle entirely. Test your solution or check if the puzzle could be solved all along.
</div>

---

<h2 align="center">Views</h2>

<p align="center"><img src="Examples/Screenshot%202026-06-21%20092112.png" /></p>

---

<h2 align="center">Features</h2>

__Instant Board Scanner__ - Snap a photo of any Sudoku puzzle and convert it into a clean, playable 9×9 grid using computer vision.

__Smart Solver__ - Get a full solution instantly, powered by a backtracking + constraint-driven algorithm.

__Hint Engine__ - Stuck on a puzzle? Request one or multiple hints, generated from the solved board and applied directly to your grid.

__Puzzle Generator__ - Create fresh Sudoku boards on demand, with guaranteed solvability.

__Board Editor__ - Manually tweak cells, fix mistakes.

__Progress Persistence__ - Your board, hints, and state are saved automatically in local storage.

__Error Checking__ - Optional real-time validation to catch duplicates and impossible moves.

---

<h2 align="center">Architecture</h2>
<h2 align="center">Class Diagram</h2>

<p align="center"><img src="Examples/Screenshot%202026-06-21%20034200.png" /></p>

<!-- TODO: full system architecture diagram goes here -->

---

<h2 align="center">Deployment</h2>
<p align="center"><img src="Examples/Screenshot%202026-06-27%20040541.png" /></p>

The app is split across two services hosted on [Render](https://render.com):

| Service | Runtime | Host |
|---|---|---|
| Sudoku Frontend | Static Site (Vite build) | Global CDN |
| Sudoku Backend | Python / Flask + Gunicorn | Virginia |

The frontend is served as a static site via Render's global CDN. The backend runs as a persistent web service, handling API requests for puzzle generation, solving, hints, and image processing.

---

<h2 align="center">Ethics</h2>

SolveSudoku takes zero liability for puzzles you could've solved yourself.

---

<h2 align="center">Contributing</h2>

If you're considering contributing to __Sudoku__, first of all, __thank you!__
Check the [Contribution Guidelines](CONTRIBUTING.md) before getting started.

---

<h2 align="center">License</h2>

Unless specified otherwise, this repository is licensed under [AGPL-3.0](LICENSE)
