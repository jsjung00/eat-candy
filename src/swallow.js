import {
  lipBottom,
  lipLeft,
  lipRight,
  lipTop,
  lipMiddle,
  LENIENCY,
  MOUTH_CLOSE_RATIO,
  MOUTH_OPEN_RATIO,
} from "./params";
/* if candy is inside the mouth (with 10% leniency), set inMouth to true. if inMouth to true and if candy is in the circle (of diameter width) of mouth,
  then return True, which will make candy deleted.
  Returns boolean which dictates if candy should be deleted. */
const isSwallowed = (face, candy, faceTime) => {
  const x = candy.x;
  const y = candy.y;
  const size = candy.size;
  const keypoints = face.keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
  const lipTopPoint = keypoints[lipTop];
  const lipBottomPoint = keypoints[lipBottom];
  const lipLeftPoint = keypoints[lipLeft];
  const lipRightPoint = keypoints[lipRight];
  const lipMiddlePoint = keypoints[lipMiddle];
  const mouthHeight = Math.abs(lipBottomPoint[1] - lipTopPoint[1]);
  const mouthWidth = Math.abs(lipRightPoint[0] - lipLeftPoint[0]);
  const ratio = mouthHeight / mouthWidth;
  //note that to be considered open it must be very open, and to be considered closed it must be very closed, i.e not direct inverses
  const mouthOpen = () => {
    return ratio > MOUTH_OPEN_RATIO;
  };
  const mouthClosed = () => {
    return ratio < MOUTH_CLOSE_RATIO;
  };
  const inMouth = () => {
    return (
      x - size > lipLeftPoint[0] * (1 - LENIENCY) &&
      x + size < lipRightPoint[0] * (1 + LENIENCY) &&
      y - size > lipTopPoint[1] * (1 - LENIENCY) &&
      y + size < lipBottomPoint[1] * (1 + LENIENCY)
    );
  };
  const inVincinity = () => {
    const xDiam = (lipRightPoint[0] - lipLeftPoint[0]) * (1 + LENIENCY);
    return (
      x - size > lipLeftPoint[0] * (1 - LENIENCY) &&
      x + size < lipRightPoint[0] * (1 + LENIENCY) &&
      y - size > lipMiddlePoint[1] - xDiam / 2 &&
      y + size < lipMiddlePoint[1] + xDiam / 2
    );
  };
  //check if mouth opened within 100ms ago
  const openedRecently = () => {
    return candy.inMouth && faceTime - candy.mouthOpenedTime < 100;
  };

  const isInMouth = inMouth();
  const isOpen = mouthOpen();
  const isClosed = mouthClosed();
  const isInVincinity = inVincinity();
  const isOpenedRecently = openedRecently();
  //const ratioElm = document.getElementById("ratio");
  //ratioElm.innerText = `x: ${x}, y: ${y}, isInMouth: ${isInMouth}, isOpen: ${isOpen}, isClosed: ${isClosed}, inVin: ${isInVincinity}`;
  //IF inside an open mouth
  if (isInMouth && isOpen) {
    candy.inMouth = true;
    candy.mouthOpenedTime = faceTime;
    return false;
  }
  //if already inMouth and mouth is now closed with candy in the vincity of mouth
  else if (
    candy.inMouth == true &&
    isClosed &&
    isInVincinity &&
    isOpenedRecently
  ) {
    return true;
  } else {
    return false;
  }
};

export { isSwallowed };
