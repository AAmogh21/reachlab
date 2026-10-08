# ReachLab: Engineering within reach

Draft for student review; verify every first-person statement before posting. Intended track: ForgeHacks AI + Education. Public repository, deployment, and video links have not been supplied or published.

## Short description

A browser robotics lab where learners move a virtual arm, train a collision predictor, and discover why high model accuracy does not guarantee collision-free motion.

## Problem and intended users

Students without access to robot hardware need opportunities to experiment with engineering ideas. ReachLab is designed for introductory robotics and AI learners: a two-link virtual arm makes geometry visible, and a model-training experiment turns prediction errors into something learners can investigate. Access is a design objective; we have not measured classroom adoption, access improvements, or learning outcomes.

## Motivation

The student guiding this project has VEX Robotics programming experience, has studied CSA and DSAI, intends to pursue mechanical engineering/mechatronics, and cares about unequal access to technology. Those interests shaped the choice of an engineering education tool. ReachLab is separate from the student's earlier physical-therapy project.

## What it does

Users change link lengths, shoulder/elbow angles, obstacle scenes, and target coordinates. Forward kinematics draws the arm; inverse kinematics identifies reachable target configurations. A configuration-space planner searches when direct motion is blocked and applies geometric collision checks plus conservative swept-motion bounds to its edges. Users can animate the resulting route.

The AI experiment generates geometry-labeled synthetic configurations and trains a periodic k-nearest-neighbors collision classifier. Users choose 100, 500, or 1,500 training examples and k of 1, 5, or 11. Evaluation uses 800 synthetic test configurations generated with a separate seed. The interface displays accuracy, recall, missed collisions, and a confusion matrix; geometry and prediction maps can be compared. Predictions never authorize a route.

Three challenges connect inverse kinematics, configuration-space planning, and model evaluation. A local notebook, training CSV download, and JSON experiment export support reflection and reproducibility. The application has no runtime AI API, account, or API-key dependency. A service worker is provided for offline use after successful first-load caching; verify offline reload in the final deployment before claiming demonstrated offline support.

## Technical approach

Vanilla JavaScript modules, HTML/CSS, Canvas rendering, a Web Worker for model generation/evaluation, and browser storage. The robot is a simplified planar kinematic model with circular obstacles and thickened link segments. A* searches a joint-angle grid; uncertain swept intervals are rejected conservatively. kNN uses a periodic angular distance, rather than treating opposite ends of an angle interval as unrelated. Both labels and evaluation derive from simulator geometry, not physical sensors.

## What is distinctive

The tool places a learned predictor beside a geometric reference and asks learners to explain disagreement. Its central lesson is that overall accuracy can hide missed collisions. Students can apply that insight to a visible mechanical system instead of only reading a definition.

## Evidence and limitations

Use the accompanying test/benchmark artifacts for verified results; do not invent metrics or transfer synthetic results to real robots. No learner study or hardware experiment has been performed. The simulator excludes dynamics, torque, self-collision, real-world uncertainty, and safety certification. Grid planning can fail even where a continuous route exists. The classifier is a teaching model, not a certified controller.

## Development and AI disclosure

Codex AI agents provided extensive implementation, debugging, testing, research assistance, and draft documentation. Verified student involvement currently consists of sharing prior experience, identifying interests, and guiding project selection; substantial student technical implementation has not yet been documented. Do not describe the code as independently student-written. The student should review the source end-to-end, run experiments, explain the algorithms, and record any subsequent changes accurately. ForgeHacks permits AI coding assistance; other competitions can impose stricter student-authorship requirements.

## Next steps

Run a small ethically conducted learner evaluation before claiming educational benefit, investigate boundary mistakes, and expand challenges only after testing. These are proposed future steps, not completed achievements.

## Before posting

Confirm student/team names, guardian permission already reported, actual registration eligibility, development dates, dependency attribution, and final artifact links. The Devpost majority-age banner conflicts with detailed age-13+ rules; resolve this in actual registration without falsely certifying eligibility. Submit only after the public video/repository and runnable product are checked.
