import "@mediapipe/face_mesh";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import { drawResults } from "./utilities";
const state = { backend: "webgl" };

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
    runtime: "mediapipe", // or 'tfjs',
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    //solutionPath: "../node_modules/@mediapipe/face_mesh",
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

const drawFace = async () => {
  const faces = await getFaces();
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (faces != null && faces.length != 0) {
    drawResults(context, faces[0], true);
  }
};

const renderFace = async () => {
  await drawFace();
  rafId = requestAnimationFrame(renderFace);
};

window.onload = () => {
  console.log("initialized");
  initialize();
};
