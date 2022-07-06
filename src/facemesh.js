const state = { backend: "webgl" };
let model;
const initializeModel = async () => {
  await tf.setBackend(state.backend);
  model = await facemesh.load({ maxFaces: 1 });
};

const getPrediction = async (video) => {
  const predictions = await model.estimateFaces(video);
  return predictions;
};

export { initializeModel, getPrediction, Candies };
