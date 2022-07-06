import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { TRIANGULATION } from "./triangulation";
import { lipsLowerOuter, lipsUpperOuter, GREEN } from "./params";

function drawPath(ctx, points, connect = false) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }
  if (connect) {
    region.closePath();
  }
  ctx.strokeStyle = "green";
  ctx.stroke(region);
}

function drawResults(ctx, face, mouthOnly = true) {
  const keypoints = face.keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
  if (mouthOnly) {
    ctx.lineWidth = 3;
    const upperLipPoints = lipsUpperOuter.map((index) => keypoints[index]);
    const lowerLipPoints = lipsLowerOuter.map((index) => keypoints[index]);
    const lipPoints = [...upperLipPoints, ...lowerLipPoints.reverse()];
    //draw upper lip
    //drawPath(ctx, upperLipPoints);
    drawPath(ctx, lipPoints, true);
  } else {
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 0.5;
    //take a window of three triangulation points, get the corresponding keypoints
    //and draw those points on the canvas
    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
      const points = [
        TRIANGULATION[i * 3],
        TRIANGULATION[i * 3 + 1],
        TRIANGULATION[i * 3 + 2],
      ].map((index) => keypoints[index]);
      drawPath(ctx, points);
    }
  }
}

export { drawResults };
