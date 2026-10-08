# Robotics core review

The model is a planar two-link arm with circular obstacles and links represented as capsules. Joint limits are inclusive [-π, π]; planning does not wrap across these hard limits. Obstacle contact counts as collision. Base and elbow endpoint disks are included. Self-collision, joint housings, torque, inertia, depth, sensor uncertainty, and hardware execution are outside this model.

## Swept-edge bound

For a straight joint-space edge with total changes Δq1 and Δq2, `edgeIsFree` divides the edge into N equal intervals. Every point on the first link moves at most L1 |Δq1| / N during an interval. Every point on the second link moves at most [L1 |Δq1| + L2 (|Δq1| + |Δq2|)] / N. This follows from the arc-length bound on rotated vectors and the triangle inequality.

Any intermediate time is at most half an interval from its nearest sampled checkpoint, so the latter displacement bound divided by two bounds movement of every material point since that checkpoint. Distance from a fixed obstacle center to the moving link set is Lipschitz under this bound. Requiring checkpoint clearance strictly greater than obstacle radius + link radius + bound/2 therefore certifies the entire edge. This also covers the final and initial half intervals. The implementation checks all checkpoints and adds a small contact tolerance. It can reject an actually free edge close to an obstacle; this is a conservative false block, not permission to cross it.

## Findings and verification

No material defect found in the reviewed geometry or swept-edge logic. Inverse kinematics returns a valid folded solution at the equal-length, zero-target singularity; this is one member of an infinite family. A* is complete only for the constructed grid and accepted edges, not for all continuous paths. Endpoint snapping can fail even when a finer grid would succeed. kNN scores are neighbor fractions, not calibrated probabilities or safety guarantees; exact checks remain authoritative.

Nine tests cover inverse branches, unreachable and folded targets, tangent and endpoint contact, second-link contact, swept collision between safe endpoints, detour validity, default-scene reachability, deterministic sampling, periodic model features, copied training data, false-safe metrics, malformed inputs, and joint-limit rejection. Run `node --test tests/robotics.test.js` from the project directory. The default-scene test verifies every returned edge and the final Cartesian target (185,125).

Benchmark labels and results are seeded synthetic geometry only. The heldout set uses a different random seed from the nested training sets. No hardware reliability, learning outcomes, participants, or real-world safety were measured.
