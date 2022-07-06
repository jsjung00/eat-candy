import { v4 as uuidv4 } from "uuid";
import { NUM_INIT_CANDIES } from "./params";
let canvas, ctx, video, canvasWidth, canvasHeight;
class Candies {
  constructor() {
    this.candies = [];
    this.missedCandyCount = 0;
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
  }
  async initCanvas() {
    const video = document.querySelector("#videoElement");
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    this.canvasWidth = videoWidth;
    this.canvasHeight = videoHeight;
    this.canvas = document.querySelector("#background");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
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
  createCandy() {
    const gravity = this.getRandomFloat(0.5, 1.0, 1);
    const size = this.randomBtw(10, 20);
    const xStart = this.randomBtw(size, this.canvasWidth - size);
    const yStart = this.randomBtw(size, this.canvasHeight / 2 - size);
    const rgb = this.randomRGB();
    const candy = new Candy(xStart, yStart, size, rgb, gravity);
    return candy;
  }
  addCandy(candy) {
    this.candies.push(candy);
  }
  removeCandy(candy) {
    console.log("before", this.candies);
    this.candies = this.candies.filter((item) => item.id != candy.id);
    console.log("after", this.candies);
  }
  drawCandies() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (const candy of this.candies) {
      candy.draw();
    }
  }
  updateAll() {
    for (const candy of this.candies) {
      candy.update();
    }
  }
  missedCandy() {
    this.missedCandyCount = this.missedCandyCount + 1;
    //console.log(`Missed Candy Count: ${this.missedCandyCount}`);
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
  }
  draw() {
    //clear previous location
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  update() {
    //missed candy
    if (this.y - this.size > this.canvasHeight) {
      super.missedCandy();
      super.removeCandy(this);
    } else {
      //move candy down screen
      this.y = this.y + this.gravity * 1;
    }
  }
  swallowed() {
    console.log("swallowed- explosion", this.candies);
    this.removeCandy(this);
  }
}

//async factory
const makeCandies = async () => {
  const candies = new Candies();
  await candies.init();
  return candies;
};

export { initCanvas, Candies, Candy, makeCandies };
