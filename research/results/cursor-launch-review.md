# Cursor launch review

October 8, 2026. This note records a bounded interface pass on `index.html`, `src/app.js`, and `src/style.css`. Research scripts, the technical report, deployment files, and the robotics core were not edited. This pass does not record a student author, a user study, a measured outcome, or an award.

## Changes

- Workbench view buttons set `aria-pressed` together with the existing `active` class. Their accessible names are still `01 Design & move`, `02 Train & test AI`, and `03 Engineering challenges`.
- Geometry (`#truth`) and AI prediction (`#prediction`) set `aria-pressed` together with the existing `selected` class. Their accessible names are still `Geometry` and `AI prediction`.
- `#insight` is a polite status region. `setStatus` writes status text only when the string changes, so dragging a link length does not repeat the same invalidation sentence.
- `#message` uses the same unchanged-text guard. Route playback still writes that region once, when motion finishes. The animation frame does not write `#message`, `#insight`, or `#map-status`.
- While a shoulder or elbow slider is focused, playback does not push intermediate values into that slider or its degree output. The finishing frame clears the animation flag before `sync`, so the slider receives one final value.
- `#cspace` is in tab order and points at `#map-hint`. The visible hint is: "Arrow keys inspect this map while Train is open."
- While the Train view is open, ArrowLeft, ArrowRight, ArrowUp, and ArrowDown step the inspected configuration by 5 degrees unless focus is in an input, select, or textarea, or a modifier key is held. Right increases shoulder angle. Up increases elbow angle. The step clamps to ±180 degrees and does not wrap. Each step, map click, map-mode change, and opening of Train updates `#map-status` with the shoulder angle, elbow angle, and geometry result. If the AI map is showing and a model exists, the same sentence adds the prediction. A press that cannot move past a joint limit adds "Joint limit." once.
- Keyboard focus uses a 3px lavender outline, offset 2px, on buttons, links, fields, `summary`, and canvas. The view nav has padding so that ring has room inside the bar.

## Preserved

- Existing element ids, including `export`, `plan`, `play`, `reset`, `train`, `truth`, `prediction`, `dataset`, `message`, `insight`, and the metric cells.
- Button accessible names used by the browser checks, including Export experiment, Plan collision-free route, Play route, Reset, Train & evaluate, Download training data, and the three challenge buttons.
- Route acceptance still uses geometry and the planner. Inspection text can mention a prediction; it does not enable Play or accept a path.
- Training callbacks still return immediately when the worker is no longer the active worker.
- Target fields still keep decimal values, ignore an empty field, and planning still requires both coordinates.
- The exact −π inverse-kinematics endpoint is still rewritten to +π only when that endpoint is nearer a positive current joint.
- Training CSV download and `reachlab-experiment-v1` JSON export are unchanged.

## Limitations

- Arrow inspection is a 5-degree step on the slider range. It is not a drag, and it does not wrap across the ±180 degree cut.
- With Train open, arrow keys move the map instead of scrolling the page, except while a field that uses arrow keys is focused.
- `#map-status` reports geometry from `isCollision`. On the AI map it also reports the current prediction. Those two labels can disagree. The prediction is not clearance.
- A repeated status string is not rewritten, so an identical message is not announced again.
- Live regions inside a `display: none` view are not a reliable announcement target. Playback completion is written to `#message` on the Design view. `#map-status` is updated at the end of playback only when Train is already open, not on intermediate frames.
- Opening Train announces the current configuration once. Holding an arrow key can queue a status update per step.

## Tests not run

No terminal commands and no browser session were run. Not run: `node --test`, `node scripts/benchmark.mjs`, `node scripts/browser-qa.mjs`, and `node scripts/review-regressions.mjs`. No new measurements were produced.
