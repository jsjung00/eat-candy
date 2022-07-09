import { v4 as uuidv4 } from "uuid";
import {
  NUM_INIT_CANDIES,
  NON_SELECTED_SHADOW,
  SELECTED_SHADOW,
  MAX_GRAVITY,
  MIN_GRAVITY,
  HARD_SCORE,
} from "./params";
let canvas, ctx, video, canvasWidth, canvasHeight;
class Candies {
  constructor() {
    this.candies = [];
    this.missedCandyCount = 0;
    this.score = 0;
    //initialize our canvas
    const video = document.querySelector("#videoElement");
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    this.canvasWidth = videoWidth;
    this.canvasHeight = videoHeight;
    const canvas = document.querySelector("#background");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.shadowBlur = 5;
  }
  async init() {
    await this.initCandies();
  }
  //create NUM_INIT_CANDIES num of non-overlapping candies
  async initCandies() {
    let i = 0;
    const notOverlapping = (xOne, yOne, sizeOne, xTwo, yTwo, sizeTwo) => {
      return (
        Math.abs(xOne - xTwo) > sizeOne + sizeTwo ||
        Math.abs(yOne - yTwo) > sizeOne + sizeTwo
      );
    };
    while (i < NUM_INIT_CANDIES) {
      const newCandy = this.createCandy();
      if (
        this.candies.every((candy) =>
          notOverlapping(
            newCandy.x,
            newCandy.y,
            newCandy.size,
            candy.x,
            candy.y,
            candy.size
          )
        )
      ) {
        i = i + 1;
        this.candies.push(newCandy);
      }
    }
  }
  randomBtw(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
  }
  randomRGB() {
    return `rgb(${this.randomBtw(0, 255)},${this.randomBtw(
      0,
      255
    )},${this.randomBtw(0, 255)})`;
  }
  //simply creates candy without adding to the candy list
  createCandy() {
    const mid_gravity_point =
      MIN_GRAVITY +
      0.1 +
      (MAX_GRAVITY - 0.1) * Math.min(1, this.score / HARD_SCORE);
    const gravity = this.getRandomFloat(
      mid_gravity_point - 0.1,
      mid_gravity_point + 0.1,
      1
    );
    const size = this.randomBtw(10, 20);
    const xStart = this.randomBtw(
      Math.floor(this.canvasWidth / 5) + size,
      this.canvasWidth - size - Math.floor(this.canvasWidth / 5)
    );
    const yStart = this.randomBtw(
      this.canvasHeight / 5,
      this.canvasHeight / 3 - size
    );
    //const yStart = this.randomBtw(size, this.canvasHeight / 3 - size);
    const rgb = this.randomRGB();
    const candy = new Candy(xStart, yStart, size, rgb, gravity);
    return candy;
  }
  //creates candy and adds to candy list
  addNewCandy() {
    const newCandy = this.createCandy();
    this.candies.push(newCandy);
  }
  //note: should be private. Candy class does not access to this.candies
  addCandy(candy) {
    this.candies.push(candy);
  }
  //note: should be private. Candy class does not have access to this.candies
  removeCandy(candy) {
    this.candies = this.candies.filter((item) => item.id != candy.id);
  }
  drawCandies() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (const candy of this.candies) {
      candy.draw();
    }
  }
  updateAll() {
    for (const candy of this.candies) {
      const didMiss = candy.update();
      if (didMiss) {
        this.missedCandy();
        this.removeCandy(candy);
      }
    }
  }
  missedCandy() {
    this.missedCandyCount = this.missedCandyCount + 1;
    console.log(`Missed Candy Count: ${this.missedCandyCount}`);
  }
}

class Candy extends Candies {
  constructor(x, y, size, color, gravity) {
    super();
    this.gravity = gravity;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.id = uuidv4();
    this.isSwallowed = false;
    this.swallowAnimationDone = false;
    this.inMouth = false;
    this.mouthOpenedTime;
    this.highlighted = false;
  }
  draw() {
    //clear previous location
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  //returns boolean if candy touchs the floor
  update() {
    //missed candy
    if (this.y - this.size > this.canvasHeight) {
      return true;
    } else {
      //move candy down screen
      this.y = this.y + this.gravity * 1;
      return false;
    }
  }
  swallowed() {
    this.isSwallowed = true;
  }
}

//async factory
const makeCandies = async () => {
  const candies = new Candies();
  await candies.init();
  return candies;
};

export { Candies, Candy, makeCandies };
