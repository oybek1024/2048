import { nums, colors } from "./data.js";
import { summ, getCols } from "./algo.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 515;
canvas.height = 515;

const boxSize = 110;
const padding = 15;
const font = "64px 'Fira Sans', sans-serif";

const state = {
  matrix: [],
  oldMatrix: [],
};

function buildMatrix() {
  new Array(4).fill(1).forEach((e) => {
    state.matrix.push(new Array(4).fill(0));
  });
}

function randomPosition(size = 4) {
  const r = Math.floor(Math.random() * size); // Get Random Column
  const c = Math.floor(Math.random() * size); // Get Random Row
  return { r, c };
}

function setRandomNumber() {
  const { r, c } = randomPosition();
  if (!state.matrix[r][c]) {
    console.log("found: ", state.matrix, r, c);
    state.matrix[r][c] = nums[2];
  } else {
    setRandomNumber();
  }
}

function drawRect(x, y, width, height, radius) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y); // Top-left corner
  ctx.lineTo(x + width - radius.tr, y); // Top-right edge
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr); // Top-right corner
  ctx.lineTo(x + width, y + height - radius.br); // Bottom-right edge
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  ); // Bottom-right corner
  ctx.lineTo(x + radius.bl, y + height); // Bottom-left edge
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl); // Bottom-left corner
  ctx.lineTo(x, y + radius.tl); // Top-left edge
  ctx.quadraticCurveTo(x, y, x + radius.tl, y); // Top-left corner
  ctx.closePath();
}

function drawDesk() {
  for (const [r, row] of state.matrix.entries()) {
    for (const [c, col] of row.entries()) {
      const x = padding + c * (boxSize + padding);
      const y = padding + r * (boxSize + padding);
      ctx.fillStyle = colors.cellColor;
      drawRect(x, y, boxSize, boxSize, 10);
      ctx.fill();
    }
  }
}

function drawNums() {
  for (const [r, row] of state.matrix.entries()) {
    for (const [c, col] of row.entries()) {
      if (col !== 0) {
        const x = padding + c * (boxSize + padding);
        const y = padding + r * (boxSize + padding);
        const { text: textColor, background } = colors.nums[String(col.num)];
        ctx.fillStyle = background;
        drawRect(x, y, boxSize, boxSize, 10);
        ctx.fill();
        ctx.font = font;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          col.num,
          x + boxSize - boxSize / 2,
          y + boxSize - boxSize / 2
        );
      }
    }
  }
}

function summVertical(to = "Up") {
  const isToTop = to === "Up";
  const direction = isToTop ? "Left" : "Right";
  const matrix = state.matrix;
  for (let i = 0; i < matrix.length; i++) {
    const col = getCols(matrix, i);
    const s = summ(
      col.map((e) => (e ? e.num : e)),
      direction
    );
    s.forEach((e, index) => {
      matrix[index][i] = nums[e] ? nums[e] : 0; // e summ of two cells
    });
  }
}

function summHorizontal(to = "Left") {
  const matrix = state.matrix;
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const s = summ(
      row.map((e) => (e ? e.num : e)),
      to
    );
    matrix[i] = s.map((e) => (nums[e] ? nums[e] : 0));
  }
}

function move(to = "Up") {
  const isVertical = to === "Up" || to === "Down";
  isVertical ? summVertical(to) : summHorizontal(to);
}

document.addEventListener("keydown", (e) => {
  const arrowKey = e.key.includes("Arrow");
  if (arrowKey) {
    const to = e.key.replace("Arrow", "");
    state.oldMatrix = JSON.parse(JSON.stringify(state.matrix));
    move(to);
    if (JSON.stringify(state.matrix) === JSON.stringify(state.oldMatrix)) {
      console.log("Not changed !");
      return;
    }
    reRender();
  }
});

function reRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDesk();
  drawNums();
  setRandomNumber();
  drawNums();
}

function render() {
  buildMatrix();
  drawDesk();
  setRandomNumber();
  setRandomNumber();
  drawNums();
}

document.fonts.ready.then(() => {
  console.log("Fonts ready");
  render();
});
