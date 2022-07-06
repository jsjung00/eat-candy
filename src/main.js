import "@mediapipe/face_mesh";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import { drawResults } from "./utilities";
import {
  initBackground,
  initCanvas,
  Candies,
  Candy,
  makeCandies,
} from "./candy";

let video, model, detector, canvas, context;
const setupCamera = async () => {
  video = document.querySelector("#videoElement");
  //video = document.createElement("video");
  //video.id = "videoElement";
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: "user", width: 640, height: 640 },
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = (event) => {
      resolve(video);
    };
  });
};

const setupCanvas = async () => {
  const canvasContainer = document.querySelector(".canvas-wrapper");
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;
  canvas = document.getElementById("output");
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  context = canvas.getContext("2d");
};

const initDetector = async () => {
  await tf.setBackend(state.backend);
  console.log(tf.getBackend());
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  //const detectorConfig = { runtime: "tfjs" };
  const detectorConfig = {
    runtime: "mediapipe",
    maxFaces: 1,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
  };
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
};

const initialize = async () => {
  console.log("loading camera");
  await setupCamera();
  video.play();
  video.width = video.videoWidth;
  video.height = video.videoHeight;
  await setupCanvas();
  console.log("loading facemesh");
  await initDetector();
  renderFace();
};

const getFaces = async () => {
  const faces = await detector.estimateFaces(video, { flipHorizontal: true });
  return faces;
};

const drawFace = async (mouthOnly = true) => {
  const faces = await getFaces();
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (faces != null && faces.length != 0) {
    drawResults(context, faces[0], mouthOnly);
  }
};

const renderFace = async () => {
  await drawFace(true);
  rafId = requestAnimationFrame(renderFace);
};

class Game {
  constructor(state) {
    this.candies;
    this.video;
    this.outputCanvas;
    this.outputContext;
    this.state = state;
  }
  async init() {
    console.log("loading camera");
    await this.setupCamera();
    this.video.play();
    this.video.width = this.video.videoWidth;
    this.video.height = this.video.videoHeight;
    await this.setupCanvas();
    console.log("loading facemesh");
    await initDetector();
    renderFace();
  }
  async setupCamera() {
    this.video = document.querySelector("#videoElement");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user", width: 640, height: 640 },
    });
    this.video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = (event) => {
        resolve(video);
      };
    });
  }

  async setupCanvas() {
    const canvasContainer = document.querySelector(".canvas-wrapper");
    const videoWidth = this.video.videoWidth;
    const videoHeight = this.video.videoHeight;
    canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;
    const outputCanvas = document.getElementById("output");
    outputCanvas.width = videoWidth;
    outputCanvas.height = videoHeight;
    this.context = outputCanvas.getContext("2d");
    this.outputCanvas = outputCanvas;
  }
  async initDetector() {
    await tf.setBackend(state.backend);
    console.log(tf.getBackend());
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    //const detectorConfig = { runtime: "tfjs" };
    const detectorConfig = {
      runtime: "mediapipe",
      maxFaces: 1,
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    };
    detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
  }

  async run() {
    await initialize();
    const candies = await makeCandies();
    const loop = () => {
      candies.drawCandies();
      candies.updateAll();
      requestAnimationFrame(loop);
    };
    loop();
  }
}

window.onload = async () => {
  await initialize();
  const state = { backend: "webgl" };
  let game = new Game(state);
  game.run();
};
