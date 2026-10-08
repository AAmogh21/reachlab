# ReachLab: verified literature and scope notes

Sources checked October 8, 2026. This is an engineering background note, not evidence that ReachLab improves learning, closes an access gap, or contributes a novel planning algorithm. The proposed benchmark is synthetic; its observations concern only its stated simulator and sample distribution.

## Robotics methods

- Kevin M. Lynch and Frank C. Park, *Modern Robotics: Mechanics, Planning, and Control*, official author textbook site: https://hades.mech.northwestern.edu/index.php/Modern_Robotics . Chapters 2, 4, 6, and 10 provide configuration-space, forward-kinematics, inverse-kinematics, and motion-planning background. A freely available author PDF is linked there.
- Official forward-kinematics worked example: https://modernrobotics.northwestern.edu/nu-gm-book-resource/forward-kinematics-example/ . Joint values map to end-effector position; this is methodological background, not ReachLab validation.
- Official inverse-kinematics introduction: https://modernrobotics.northwestern.edu/nu-gm-book-resource/inverse-kinematics-of-open-chains/ . Multiple or no solutions are possible. ReachLab's elementary two-link analytic solution should be described as the usual planar derivation, not a new method.
- C-space obstacles: https://modernrobotics.northwestern.edu/nu-gm-book-resource/10-2-c-space-obstacles/ . Collision regions belong to configuration space; obstacle shapes in workspace cannot simply be treated as equivalent shapes in joint space.
- Grid planning and A*: https://modernrobotics.northwestern.edu/nu-gm-book-resource/10-4-grid-methods-for-motion-planning/ . The author description specifically treats a 2R robot, graph neighborhoods, angular wraparound, and discretization. A grid planner can miss passages below its resolution. Optimality, if established, is for its graph and cost function, not every continuous robot motion.

For a planar two-link arm, the end-effector equations are x=L1 cos(q1)+L2 cos(q1+q2), y=L1 sin(q1)+L2 sin(q1+q2). For circle obstacles and line-segment links, project the circle center onto the segment, clamp the parameter to [0,1], and compare the closest distance with the obstacle radius (plus link radius if links have thickness). This formula follows directly from Euclidean projection. A geometric test is exact only for its modeled geometry. The current `edgeIsFree` implementation supplements configuration samples with a conservative link-point displacement bound. Its endpoint clearance margin certifies each interpolated subinterval under the model, rejecting uncertainty. See `technical-report.md` for its bound and limitations, including omitted self-collision and no hardware safety validation. Isolated samples without this additional bound would not establish continuous collision freedom.

## Supervised learning and honest evaluation

- Official scikit-learn nearest-neighbor guide: https://scikit-learn.org/stable/modules/neighbors.html . kNN classification predicts from labels of nearby training examples. A JavaScript reimplementation may cite this as background without implying it uses scikit-learn.
- Official classification example: https://scikit-learn.org/stable/auto_examples/neighbors/plot_classification . Shows held-out examples, uniform versus distance weighting, and the importance of scaling for Euclidean distance.
- Official evaluation guide: https://scikit-learn.org/stable/modules/cross_validation.html . Test data must remain separate from training and parameter selection.

For periodic joints, naive Euclidean distance across -pi/pi has a discontinuity. Use a documented periodic feature encoding or angular distance, and report which was actually implemented. Keep k, features, seeds, scene geometry, training count, and test count explicit. Include collision-class recall and false negatives, not accuracy alone. Changing obstacles changes labels; a classifier trained for one scene is not automatically valid for another. Exact geometry should govern path acceptance; the learned classifier is a visualization/approximation exercise rather than a real-robot safety mechanism. Do not claim faster planning unless timing measurements support that specific comparison.

## Existing virtual robotics work

- VEX official setup: https://www.vexrobotics.com/vexcode/install/vr . Existing virtual-robot coding platform with no installation needed. This directly prevents a claim that browser robotics education itself is new.
- VEX supported-browser documentation: https://kb.vex.com/hc/en-us/articles/360041900951-Accessing-VEXcode-VR-on-Supported-Browsers . Describes a web coding environment for virtual robots; updated March 25, 2026.
- Cyberbotics' original Robotbenchmark announcement, August 21, 2017: https://cyberbotics.com/doc/blog/robotbenchmark . Describes browser simulations and programming challenges across experience levels. Use as historical related work. The robotbenchmark.net domain itself currently returned unrelated gambling material in the browser search fetch and should not be offered as a live student resource.
- Official Webots description: https://www.cyberbotics.com/doc/guide/foreword?version=R2023a . Background on an established open-source simulator.

ReachLab's appropriate claim is a specific implementation combining a small local planar-arm lab, exact modeled geometry, joint-space planning, and a visible synthetic learning experiment. Do not assert unique/first/best status or measured educational superiority.

## Access motivation, with dates and limits

- NCES, *Children's Internet Access at Home*, updated August 2023, using 2021 ACS data: https://nces.ed.gov/programs/coe/indicator/cch/access-to-computers-and-the-internet . Reports 97% of ages 3–18 had home internet, 93% through a computer, 4% smartphone only, and 3% no home internet. Its computer definition includes tablets and other portable computers; it is not a desktop/laptop-only statistic. These are historical nationwide estimates, not a 2026 local survey.
- NCES, *Rural Students' Access to the Internet*, updated November 2023, using 2019 data: https://nces.ed.gov/programs/coe/indicator/lfc/ . Historical fixed-broadband access differed by locale.

These sources justify investigating fewer download/network requirements. They do not show that ReachLab reaches underserved students, that robotics hardware is unavailable to a particular group, or that the app changes achievement. Offline operation requires actual verification. A local browser app still requires a suitable device and initial distribution.

## Research-submission fit

- JEI engineering and ML scope, updated August 15, 2025: https://emerginginvestigators.org/submissions/engineering-and-machine-learning-based-projects . A paper solely introducing/optimizing an invention or comparing ML accuracy is not eligible under its current stated scope. A scientific question supported by suitable experiments is required.
- JEI eligibility: https://emerginginvestigators.org/submissions/author-eligibility . Student eligibility alone is insufficient: a senior adult author is required and an adult submits.
- JEI integrity/AI policy: https://www.emerginginvestigators.org/submissions/academic-honesty-and-ai . Verify its full AI requirements before any submission. No fabricated data, citations, authorship, or approvals.
- eiRxiv current topics: https://eirxiv.org/2026/03/30/topics-we-accept/ . Excludes purely computational/modeling work without supporting physical experiments and manuscripts that only compare inventions/models/methods. Therefore the proposed synthetic engineering benchmark is not presently a clear fit.
- eiRxiv process: https://eirxiv.org/eirxiv-posting-process/ . Requires a coordinating adult; its stated submission-to-feedback process is approximately 5–12 weeks. This does not support a promise of publication by November 1.
- engrXiv AI policy: https://engrxiv.org/ai-policy . Permits disclosed, supervised literature searching, organization, copy editing, and machine-assisted analysis; prohibits verbatim AI-generated prose, whole AI papers without substantive human contribution, and technical assessments of AI programs performed by LLMs. A human researcher must first do and verify substantive work, write their own account, disclose assistance, and assess fit. Acceptance and moderation timing remain uncertain.

The concrete deliverable can be an openly labeled reproducible engineering technical report in the project repository. It must not be represented as peer-reviewed, accepted, published in a journal, or authored solely by the student if those claims are not true. Submission-ready materials should preserve the actual division of human and AI contributions. Competition eligibility and journal eligibility are separate checks.
