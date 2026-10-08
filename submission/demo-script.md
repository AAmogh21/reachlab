# ReachLab demo script — target 3 minutes 20 seconds

Draft narration and recording plan, not a recorded or uploaded video. Rehearse on the final build; show actual values instead of reading invented metrics. Public ForgeHacks demo must be 2–4 minutes. Record screen plus your own narration; confirm all personal statements.

## 0:00–0:25 — problem and introduction

Show landing/workbench.

“This is ReachLab, a browser lab for learning robotics without owning a robot. I program for VEX Robotics and am interested in mechatronics and unequal access to technology. This project explores a question: how can students learn mechanics and AI by testing ideas themselves?”

## 0:25–1:00 — mechanics you can change

Use Open bench, change shoulder/elbow angles, then one link length. Choose an attainable target and plan/play a route.

“The arm has two links. Changing the angles changes its end-effector position. The reachable region depends on both link lengths. Inverse kinematics finds configurations for a chosen target. This is a kinematic simulation; it does not represent motor torque or physical robot safety.”

## 1:00–1:35 — geometry and planning

Switch to Workshop; Reset restores default angles/target. Plan and play if a valid route is found. If blocked, explain the actual message rather than hiding it.

“An obstacle can hit either link, even when the tip looks clear. The planner checks direct motion or searches joint-angle space with A*. Geometric checks and conservative bounds validate the motion edges within this simplified model. A learned prediction is never allowed to authorize a route.”

## 1:35–2:30 — train and inspect AI

Open Train & test AI. Choose 100 samples, k=5; train. Show metrics and confusion matrix, switch between Geometry and AI prediction maps. Select 1,500 samples and retrain only if time permits.

“The simulator generates synthetic labeled examples. This k-nearest-neighbors model predicts collision from nearby arm configurations. It is tested on 800 configurations generated from a separate seed. Here are the actual accuracy, recall, and missed-collision counts. A missed collision means the model said free where geometry said collision. More examples may improve results, but neither accuracy nor zero observed misses creates a guarantee.”

Read the actual count. If no misses appear, explicitly say “zero in this test,” not “zero possible.” Keep the exact geometry map visible beside the AI toggle; do not imply predictions drive planning.

## 2:30–2:55 — learning and evidence

Open Engineering challenges, expand one explanation, enter a brief real experiment note, export JSON, and download CSV if convenient.

“The challenges ask learners to predict, experiment, and explain. They connect kinematics, planning, and model evaluation. Notes and experiment exports make it possible to record what happened. We have not yet measured student learning outcomes.”

## 2:55–3:20 — offline and authorship

Only show offline reload after verifying successful service-worker installation on localhost/HTTPS. Otherwise show local operation and omit the demonstrated offline claim.

“Computation runs on the device without AI API keys or accounts. [If verified: After this first successful load, the app also reloads offline.] Codex AI agents provided extensive implementation and testing assistance. My verified contribution so far is project direction and the background that shaped it; I will describe any further technical contributions accurately. This prototype is an education experiment, not a physical robot controller.”

## Recording checklist

- Final build and assets load; missing report assets must not break service-worker caching.
- Capture real training values and planner behavior; never substitute imagined successful results.
- End-to-end runtime is between 2 and 4 minutes and narration remains legible.
- Public video/repository/deployment URLs are absent until actually published; no invented links.
- Reconfirm actual event registration age eligibility; guardian permission is already reported.
