# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Vanilla JS Sudoku web app served as static files (no build step, no package manager, no tests/lint configured).
- Entry point is index.html, which loads src/sudoku.js (core logic) and src/game.js (UI wiring) in that order.

Common commands
- Serve locally (recommended over opening file:// to avoid any CORS quirks):
```bash path=null start=null
python3 -m http.server 8000
# then open http://localhost:8000
```
- Alternatively, open directly in a browser (as documented in README):
```bash path=null start=null
xdg-open index.html  # Linux
# macOS: open index.html
# Windows (PowerShell): start index.html
```
- Linting/formatting: not configured in this repo.
- Tests: not configured in this repo.

Architecture and code structure (big picture)
- Core Sudoku module (src/sudoku.js)
  - Exposes a browser global Sudoku with the primary capabilities needed by the UI: generatePuzzle(difficulty) from preset strings, validateUserGrid(grid) for conflict detection, solve(grid) via backtracking (used to confirm a completed board), isValid, isComplete, formatGrid, and idx for 2D→1D indexing.
  - Difficulty presets (easy/medium/hard) are defined as 81-char strings (0 means empty) and parsed into a flat 81-length array. No generator or persistence; puzzles are randomly chosen from the preset lists.
- UI controller (src/game.js)
  - Keeps two pieces of state: puzzle (immutable base puzzle) and userGrid (mutable user inputs).
  - Renders a 9×9 grid of divs; prefilled cells are locked; empty cells render <input> fields. Input sanitation restricts to digits 1–9.
  - On every change, validateAndUpdate() uses Sudoku.validateUserGrid to flag the first conflicting cell and updates a message region. When userGrid is complete, it confirms correctness by solving the original puzzle and matching results.
  - Wire-up: difficulty dropdown triggers newGame(); New Game picks a fresh puzzle; Reset copies puzzle back into userGrid and re-renders.
- App shell (index.html)
  - Provides controls (difficulty, New Game, Reset), the board container, and message area. Loads styles.css and then scripts in correct dependency order: src/sudoku.js before src/game.js.
- Styles (styles.css)
  - CSS grid for the 9×9 layout, thicker borders between 3×3 blocks, highlighting of invalid cells, and basic app framing.

Notes and assumptions for future changes
- The Sudoku module assumes a browser environment (attaches to window). If migrating to a bundler/module system, preserve load order or export/import appropriately.
- The solver is used only to verify a completed board; gameplay validation relies on Sudoku.validateUserGrid to check conflicts incrementally.
- To add more puzzles, extend the PUZZLES map in src/sudoku.js or replace it with a generator; keep strings at 81 characters with 0 for blanks.
