import "../node_modules/@mediapipe/face_mesh";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { drawResults } from "./utilities";
import { makeCandies } from "./candy";
import { isSwallowed } from "./swallow";
import { MIN_CANDY_NUM } from "./params";
class Main {
  constructor(state, detectorConfig) {
    this.candiesObj;
    this.video;
    this.outputCanvas;
    this.outputContext;
    this.state = state;
    this.detector;
    this.detectorConfig = detectorConfig;
    this.score = 0;
    this.INIT_LIVES = 3;
    this.lives = this.INIT_LIVES;
    this.MIN_CANDY_NUM = MIN_CANDY_NUM;
    this.faceTimer = 0; //ms once loop starts for renderFace
  }
  async initFace() {
    console.log("loading camera");
    await this.setupCamera();
    this.video.play();
    this.video.width = this.video.videoWidth;
    this.video.height = this.video.videoHeight;
    await this.setupOutputCanvas();
    console.log("loading facemesh");
    await this.initDetector();
  }
  async setupCamera() {
    const video = document.querySelector("#videoElement");
    console.log("video", video);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user", width: 640, height: 640 },
    });
    video.srcObject = stream;
    this.video = video;
    return new Promise((resolve) => {
      this.video.onloadedmetadata = (event) => {
        resolve(this.video);
      };
    });
  }

  async setupOutputCanvas() {
    const canvasContainer = document.querySelector(".canvas-wrapper");
    const videoWidth = this.video.videoWidth;
    const videoHeight = this.video.videoHeight;
    canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;
    const outputCanvas = document.getElementById("output");
    outputCanvas.width = videoWidth;
    outputCanvas.height = videoHeight;
    this.outputContext = outputCanvas.getContext("2d");
    this.outputCanvas = outputCanvas;
  }
  async initDetector() {
    await tf.setBackend(this.state.backend);
    console.log(tf.getBackend());
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detector = await faceLandmarksDetection.createDetector(
      model,
      this.detectorConfig
    );
    this.detector = detector;
  }

  renderFace() {
    const loop = async () => {
      await this.drawFace(true);
      const faceLoopDuration = requestAnimationFrame(loop);
      this.faceTimer = faceLoopDuration;
    };
    loop();
  }

  async getFaces() {
    const faces = await this.detector.estimateFaces(this.video, {
      flipHorizontal: true,
    });
    return faces;
  }

  async drawFace(mouthOnly = true) {
    const faces = await this.getFaces();
    //clear canvas
    this.outputContext.clearRect(
      0,
      0,
      this.outputCanvas.width,
      this.outputCanvas.height
    );
    if (faces != null && faces.length != 0) {
      drawResults(this.outputContext, faces[0], mouthOnly);
      this.swallowUpdate(faces[0]);
    }
  }
  swallowUpdate(face) {
    for (const candy of this.candiesObj.candies) {
      if (isSwallowed(face, candy, this.faceTimer)) {
        this.addScore();
        candy.swallowed();
        this.candiesObj.removeCandy(candy);
      }
    }
  }
  async run() {
    this.initText();
    await this.initFace();
    const candies = await makeCandies();
    this.candiesObj = candies;
    this.renderFace();
    const loop = () => {
      console.log("candies", this.candiesObj);
      this.candiesObj.drawCandies();
      this.candiesObj.updateAll();
      this.updateLives(this.candiesObj.missedCandyCount);
      let candyRafId = requestAnimationFrame(loop);
      //create a new candy every 200 seconds
      if (candyRafId > 0 && candyRafId % 200 == 0) {
        this.candiesObj.addNewCandy();
      }
      //make sure there is at least MIN_NUM_CANDY on the screen
      while (this.candiesObj.candies.length < this.MIN_CANDY_NUM) {
        this.candiesObj.addNewCandy();
      }
    };
    loop();
  }
  //Game logic
  addScore() {
    this.candiesObj.score += 1;
    this.score += 1;
    const scoreText = document.getElementById("score");
    scoreText.innerText = `${this.score}`;
  }
  updateLives(totalMissed) {
    console.log(totalMissed);
    if (totalMissed && totalMissed > 0) {
      this.lives = this.INIT_LIVES - totalMissed;
      const livesText = document.getElementById("lives");
      livesText.innerText = `Lives: ${this.lives}`;
    }
  }
  initText() {
    const scoreText = document.getElementById("score");
    scoreText.innerText = `${this.score}`;
    const livesText = document.getElementById("lives");
    livesText.innerText = `Lives: ${this.lives}`;
  }
}

window.onload = async () => {
  const state = { backend: "webgl" };
  const detectorConfig = {
    runtime: "mediapipe",
    maxFaces: 1,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
  };
  let game = new Main(state, detectorConfig);
  game.run();
};
