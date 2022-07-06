import { lipBottom, lipLeft, lipRight, lipTop } from "./params";
const isSwallowed = (face, candy) => {
  const x = candy.x;
  const y = candy.y;
  const size = candy.size;
  const keypoints = face.keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
  const lipTopPoint = keypoints[lipTop];
  const lipBottomPoint = keypoints[lipBottom];
  const lipleftPoint = keypoints[lipLeft];
  const lipRightPoint = keypoints[lipRight];
  if (
    x - size > lipleftPoint[0] &&
    x + size < lipRightPoint[0] &&
    y - size > lipTopPoint[1] &&
    y + size < lipBottomPoint[1]
  ) {
    return true;
  } else {
    //console.log(x - size, lipleftPoint[0], x + size, lipRightPoint[1]);
    return false;
  }
};

export { isSwallowed };
