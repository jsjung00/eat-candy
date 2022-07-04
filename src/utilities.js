import { TRIANGULATION } from "./triangulation";
const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const GREEN = "#32EEDB";
const RED = "#FF2C35";
const BLUE = "#157AB3";

function drawPath(ctx, points) {
  console.log("points", points);
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }
  ctx.strokeStyle = "green";
  ctx.stroke(region);
}

function drawResults(ctx, face, displayTriangulateMesh) {
  const keypoints = face.keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
  console.log("keypoints", keypoints);
  if (displayTriangulateMesh) {
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
