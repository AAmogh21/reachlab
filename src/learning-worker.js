import { sampleDataset, trainKNN, evaluateModel } from "./robotics.js";
self.onmessage = ({ data }) => {
  try {
    const { config, count, k } = data,
      samples = sampleDataset(config, count, 314159),
      model = trainKNN(samples, k),
      metrics = evaluateModel(model, sampleDataset(config, 800, 90210));
    const map = [];
    for (let y = 0; y < 48; y++)
      for (let x = 0; x < 64; x++)
        map.push(
          model.predict(
            -Math.PI + ((x + 0.5) * Math.PI * 2) / 64,
            Math.PI - ((y + 0.5) * Math.PI * 2) / 48,
          ).collision,
        );
    self.postMessage({ samples, k, metrics, map });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
