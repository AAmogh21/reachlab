import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  sampleDataset,
  trainKNN,
  evaluateModel,
  forwardKinematics,
  pointSegmentDistance,
} from "../src/robotics.js";
const scenes = [
  {
    name: "Workshop",
    obstacles: [
      { x: 180, y: 0, r: 12 },
      { x: -150, y: -60, r: 18 },
    ],
  },
  {
    name: "Three obstacles",
    obstacles: [
      { x: 145, y: 35, r: 22 },
      { x: 65, y: -110, r: 24 },
      { x: -105, y: 75, r: 18 },
    ],
  },
  {
    name: "Offset obstacles",
    obstacles: [
      { x: 110, y: 110, r: 25 },
      { x: -120, y: 90, r: 20 },
      { x: 70, y: -140, r: 15 },
    ],
  },
];
const trainingSeeds = [314159, 271828, 161803, 57721, 141421];
const heldoutSeeds = [90210, 73519, 86420, 24680, 13579];
const sizes = [100, 500, 1500],
  rows = [];
for (const scene of scenes) {
  const config = {
    links: [130, 100],
    base: { x: 0, y: 0 },
    linkRadius: 5,
    obstacles: scene.obstacles,
  };
  for (let replicate = 0; replicate < 5; replicate++) {
    const test = sampleDataset(config, 1000, heldoutSeeds[replicate]);
    const baseline = evaluateModel(
      { predict: () => ({ collision: false }) },
      test,
    );
    const boundary = test.filter((s) => {
      const { base, elbow, tip } = forwardKinematics(s.q1, s.q2, config);
      const clearance = Math.min(
        ...config.obstacles.map(
          (o) =>
            Math.min(
              pointSegmentDistance(o, base, elbow),
              pointSegmentDistance(o, elbow, tip),
            ) -
            o.r -
            config.linkRadius,
        ),
      );
      return Math.abs(clearance) <= 5;
    });
    for (const trainingCount of sizes) {
      const model = trainKNN(
        sampleDataset(config, trainingCount, trainingSeeds[replicate]),
        5,
      );
      rows.push({
        scene: scene.name,
        replicate,
        trainingSeed: trainingSeeds[replicate],
        heldoutSeed: heldoutSeeds[replicate],
        trainingCount,
        k: 5,
        metrics: evaluateModel(model, test),
        boundaryMetrics: evaluateModel(model, boundary),
        constantFreeBaseline: baseline,
      });
    }
  }
  console.log("Completed " + scene.name);
}
const summarize = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return {
    mean,
    sd: Math.sqrt(
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1),
    ),
    min: Math.min(...values),
    max: Math.max(...values),
    n: values.length,
  };
};
const summaries = scenes.flatMap((scene) =>
  sizes.map((trainingCount) => {
    const group = rows.filter(
      (r) => r.scene === scene.name && r.trainingCount === trainingCount,
    );
    return {
      scene: scene.name,
      trainingCount,
      accuracy: summarize(group.map((r) => r.metrics.accuracy)),
      recall: summarize(group.map((r) => r.metrics.recall)),
      falseSafeRate: summarize(group.map((r) => r.metrics.falseSafeRate)),
      boundaryRecall: summarize(group.map((r) => r.boundaryMetrics.recall)),
      baselineAccuracy: summarize(
        group.map((r) => r.constantFreeBaseline.accuracy),
      ),
      missedCollisions: group.map((r) => r.metrics.falseSafe),
    };
  }),
);
const result = {
  scope:
    "Synthetic geometry; descriptive five-seed comparison in three selected scenes, not a hardware or learner study. No hyperparameter tuning or inferential significance claims.",
  design: {
    scenes,
    trainingSeeds,
    heldoutSeeds,
    sizes,
    k: 5,
    testCountPerSceneSeed: 1000,
    boundaryBand: 5,
    trainingSets: "Nested within each seed",
    testSets:
      "Shared across sizes within each scene/seed; distinct seed from training",
    summary:
      "Arithmetic mean and sample standard deviation across five seed runs, not a confidence interval",
  },
  rows,
  summaries,
};
const dir = fileURLToPath(new URL("../research/results/", import.meta.url));
await writeFile(
  dir + "extended-benchmark.json",
  JSON.stringify(result, null, 2) + "\n",
);
await writeFile(
  dir + "extended-benchmark.csv",
  "scene,replicate,trainingCount,accuracy,recall,falseSafeRate,boundaryCount,boundaryRecall,falseSafe,baselineAccuracy\n" +
    rows
      .map((r) =>
        [
          r.scene,
          r.replicate,
          r.trainingCount,
          r.metrics.accuracy,
          r.metrics.recall,
          r.metrics.falseSafeRate,
          r.boundaryMetrics.sampleCount,
          r.boundaryMetrics.recall,
          r.metrics.falseSafe,
          r.constantFreeBaseline.accuracy,
        ].join(","),
      )
      .join("\n") +
    "\n",
);
console.log(JSON.stringify(summaries, null, 2));
