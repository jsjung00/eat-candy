const lipsUpperOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
const lipsLowerOuter = [146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const lipTop = 0;
const lipBottom = 17;
const lipRight = 291;
const lipLeft = 61;
const lipMiddle = 14;
const NUM_KEYPOINTS = 468;
const NUM_INIT_CANDIES = 4;
const GREEN = "#32EEDB";
const RED = "#FF2C35";
const BLUE = "#157AB3";
const MOUTH_OPEN_RATIO = 0.7; //height needs to be at least 0.7 times width of mouth to be considered open
const MOUTH_CLOSE_RATIO = 0.5; //height needs to be smaller than 0.5 times width of mouth to be considered closed
const LENIENCY = 0.0; //make mouth "size" 10% larger to detect swallow
const MIN_CANDY_NUM = 4;
const NON_SELECTED_SHADOW = "white"; //shadow of candy when non-selected (i.e within mouth)
const SELECTED_SHADOW = "red";
const MAX_GRAVITY = 2;
const MIN_GRAVITY = 0.5;
const HARD_SCORE = 100; //max_gravity turned on at this score
export {
  lipsUpperOuter,
  lipsLowerOuter,
  lipTop,
  lipBottom,
  lipRight,
  lipLeft,
  lipMiddle,
  NUM_INIT_CANDIES,
  NUM_KEYPOINTS,
  GREEN,
  RED,
  BLUE,
  MOUTH_OPEN_RATIO,
  MOUTH_CLOSE_RATIO,
  LENIENCY,
  MIN_CANDY_NUM,
  NON_SELECTED_SHADOW,
  SELECTED_SHADOW,
  MAX_GRAVITY,
  MIN_GRAVITY,
  HARD_SCORE,
};
