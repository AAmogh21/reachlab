# ReachLab

**Engineering, within reach.** A free local robotics workbench for students who want to explore robot geometry, path planning, and machine learning without robot hardware.

ReachLab is an independent new project. It does not use code, datasets, or research from the student's separate physical therapy application.

## Run

Use Node.js 22 or newer. No package installation, account, API key, or paid service is needed.

```sh
node scripts/server.mjs
```

Open http://127.0.0.1:4173. Keep the terminal running. Do not open index.html directly: browser ES modules, workers, and offline caching require a local HTTP server or HTTPS host.

On the configured Windows machine, double-click `Start-ReachLab.cmd`. Cursor's Terminal → Run Task also provides start, test, and benchmark tasks. Its workspace terminal PATH includes the downloaded Node runtime and GitHub CLI, plus the existing Git executable.

## Explore

1. **Design & move:** change link lengths, joint angles, and obstacle scenes. Set a target through the canvas or numeric coordinates. Plan and play a geometry-validated route.
2. **Train & test AI:** train a real k-nearest-neighbors classifier on synthetic configurations. Compare geometry against predictions, inspect held-out errors, and download training CSV data.
3. **Engineering challenges:** explore inverse kinematics, configuration-space planning, and why accuracy alone can hide missed collisions. Save a reflection locally and export a JSON experiment.

The browser caches application files after a successful first load for offline revisits. Initial access and distribution still require a suitable device and the app files. Browser storage rules and private browsing can affect persistence. No analytics, external scripts, cloud inference, or data upload is built into the app. The notebook stays on the device unless exported by the user.

## What is implemented

- Analytic forward and inverse kinematics for a two-link planar arm.
- Capsule-versus-circle geometry with modeled link thickness.
- Joint-space A* with hard joint limits and conservative swept-motion clearance checks.
- Periodic-feature kNN learned collision classification, separate training/test seeds, confusion matrix, accuracy, recall, and missed collisions.
- Model invalidation when the environment changes; learned predictions never approve a route.
- Responsive controls, keyboard-operable sliders and coordinate inputs, local notes, and downloads.
- A seeded benchmark, automated core tests, and a technical report with limitations.

## Verification and evidence

```sh
node --test
node scripts/benchmark.mjs
```

Optional development checks use the pinned tools in `package-lock.json`:

```sh
npm ci
npx playwright install chromium
npm run lint
npm run test:browser
```

Keep the local server running for the browser checks. These tools are not needed to use the app. A captioned demonstration is saved in `submission/reachlab-demo.webm`.

The technical report and benchmark are under `research/`. Evaluation uses simulated geometry; it is not a human learning study or physical-robot test. The benchmark scene is intentionally different from the default UI scene. Browser evaluation uses 800 test configurations; the saved research benchmark uses 3,000. Their metrics must not be conflated.

## Limits

This is a kinematic education tool, not a real robot controller. It omits dynamics, torque, friction, link-link self-collision, joint hardware, and sensing error. Conservative motion checks can reject feasible near-obstacle movements. A fixed grid can miss narrow passages. Successful simulation does not certify physical safety. Virtual robotics education already exists; no claim of a first or unique algorithm is made.

## Authorship and disclosure

The human directed project choice and supplied interests and robotics background. AI assistants performed extensive implementation, testing, literature discovery, and drafting. Student review, experiments, revisions, and explanations should be recorded in `CONTRIBUTIONS.md` as they occur. Do not describe this code as solely student-authored, invent deployment reach, or represent the technical report as peer-reviewed.

Submission drafts are under `submission/`. No competition or journal submission, award, or acceptance is implied by these files. Verify each venue's eligibility and AI policy; some require substantial student technical work. Guardian permission was confirmed by the user; congressional district is still needed for CAC eligibility.

## License

Project source is provided under the MIT license in `LICENSE`. Reference links are citations, not bundled third-party code. ReachLab uses native browser APIs and a JavaScript implementation of standard algorithms; no third-party runtime library is shipped.
