"use strict";
var mine = [];
var drawArr = [];
var saveDrawArr = [];
var help = 0;
var helpX = 0;
var helpY = 0;
var canvas;
var seedSeeds;
var velikostX;
var velikostY;
var minesCount;
var reset = false;
var images = [];
var audio;
var winSound;
function saveValue(x, y, value) {
  this.xCoord = x;
  this.yCoord = y;
  this.value = value;
}

function preload() {
  images[0] = loadImage("images\\UnOpened.png");
  images[1] = loadImage("images\\Mine.jpg");
  images[2] = loadImage("images\\MineFound.jpg");
  audio = new Audio("Sound\\Granate.mp3");
  winSound = new Audio("Sound\\Win.mp3");
}
function setup() {
  canvas = createCanvas(1000, 500);
  startWithMoreArg(15, 10 * 5, 5 * 5);
  //drawArr=mine;
  frameRate(5);
}

function start(seed, size) {
  saveDrawArr = [];
  minesCount = 0;
  seedSeeds = seed;
  velikostX = size;
  velikostY = size;
  var done = false;
  mine = [];
  drawArr = [];
  let zeroLine = [];
  for (var x = 0; x < size; x++) {
    let line = [];
    zeroLine = [];
    for (var y = 0; y < size; y++) {
      zeroLine.push(-1);
      if (Math.floor(Math.random() * seed) === 1) {
        line.push(1);
        minesCount++;
      } else {
        line.push(0);
      }
    }
    done = true;
    mine.push(line);
    drawArr.push(zeroLine);
  }
  help = width / size;
  helpX = width / size;
  helpY = height / size;
}

function startWithMoreArg(seed, sizeX, sizeY) {
  saveDrawArr = [];
  minesCount = 0;
  seedSeeds = seed;
  velikostX = sizeX;
  velikostY = sizeY;
  var done = false;
  mine = [];
  drawArr = [];
  for (var x = 0; x < sizeX; x++) {
    let line = [];
    let zeroLine = [];
    for (var y = 0; y < sizeY; y++) {
      zeroLine.push(-1);
      if (Math.floor(Math.random() * seed) === 1) {
        line.push(1);
        minesCount++;
      } else {
        line.push(0);
      }
    }
    done = true;
    mine.push(line);
    drawArr.push(zeroLine);
  }
  help = width / sizeX;
  helpX = width / sizeX;
  helpY = height / sizeY;
}
function win() {
  let saveMineCount = 0;
  let bool = true;
  saveDrawArr.forEach(p => {
    if (p != undefined) {
      if (mine[p.xCoord][p.yCoord] === 1) {
        saveMineCount++;
      } else {
        bool = false;
      }
    }
  });
  if (saveMineCount === minesCount && bool) {
    winSound.play();
    winSound = new Audio("Sound\\Win.mp3");
    return true;
  }
  return false;
}
function lose() {
  audio.play();
  audio = new Audio("Sound\\Granate.mp3");
  drawArr = mine;
}

function mineFound(x, y) {
  if (drawArr[x][y] === -3) {
    saveDrawArr = saveDrawArr.filter(o => forEachFromSaveDrawArr(o, x, y));
  } else {
    saveDrawArr.push(new saveValue(x, y, drawArr[x][y]));
    drawArr[x][y] = -3;
  }
}

function forEachFromSaveDrawArr(o, x, y) {
  if (o != undefined) {
    if (o.yCoord === y && o.xCoord === x) {
      drawArr[x][y] = o.value;
      return undefined;
    } else {
      return o;
    }
  }
  return undefined;
}

function drawGrey(o, p) {
  beenTo = [];
  for (var x = 0; x < velikostX; x++) {
    let zeroLine = [];
    for (var y = 0; y < velikostY; y++) {
      zeroLine.push(0);
    }
    beenTo.push(zeroLine);
  }
  drawGreyAgain(o, p, beenTo);
}

var beenTo;

function drawGreyAgain(x, y) {
  if (drawArr[x][y] === -2) {
  } else {
    drawArr[x][y] = mine[x][y];
  }
  beenTo[x][y] = 1;
  // console.log(beenTo + "," + x + "x" + "," + y + "y");
  if (x < velikostX - 1) {
    if (beenTo[x + 1][y] === 0) {
      if (
        mine[x + 1][y] === 0 &&
        (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y] != -1)
      ) {
        drawGreyAgain(x + 1, y, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
    if (y > 0) {
      if (beenTo[x + 1][y - 1] === 0) {
        if (
          mine[x + 1][y - 1] === 0 &&
          (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y - 1] != -1)
        ) {
          drawGreyAgain(x + 1, y - 1, beenTo);
        } else {
          drawArr[x][y] = -2;
        }
      }
    }
    if (y < velikostY) {
      if (beenTo[x + 1][y + 1] === 0) {
        if (
          mine[x + 1][y + 1] === 0 &&
          (getMinesNextTo(x, y) < 1 || drawArr[x + 1][y + 1] != -1)
        ) {
          drawGreyAgain(x + 1, y + 1, beenTo);
        } else {
          drawArr[x][y] = -2;
        }
      }
    }
  }

  if (x > 0) {
    if (beenTo[x - 1][y] === 0) {
      if (
        mine[x - 1][y] === 0 &&
        (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y] != -1)
      ) {
        drawGreyAgain(x - 1, y, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
    if (y > 0) {
      if (beenTo[x - 1][y - 1] === 0) {
        if (
          mine[x - 1][y - 1] === 0 &&
          (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y - 1] != -1)
        ) {
          drawGreyAgain(x - 1, y - 1, beenTo);
        } else {
          drawArr[x][y] = -2;
        }
      }
    }
    if (y < velikostY) {
      if (beenTo[x - 1][y + 1] === 0) {
        if (
          mine[x - 1][y + 1] === 0 &&
          (getMinesNextTo(x, y) < 1 || drawArr[x - 1][y + 1] != -1)
        ) {
          drawGreyAgain(x - 1, y + 1, beenTo);
        } else {
          drawArr[x][y] = -2;
        }
      }
    }
  }
  if (y < velikostY) {
    if (beenTo[x][y + 1] === 0) {
      if (
        mine[x][y + 1] === 0 &&
        (getMinesNextTo(x, y) < 1 || drawArr[x][y + 1] != -1)
      ) {
        drawGreyAgain(x, y + 1, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
  if (y > 0) {
    if (beenTo[x][y - 1] === 0) {
      if (
        mine[x][y - 1] === 0 &&
        (getMinesNextTo(x, y) < 1 || drawArr[x][y - 1] != -1)
      ) {
        drawGreyAgain(x, y - 1, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
}

document.addEventListener("click", function(evt) {
  var x = evt.pageX - $("#Hra").offset().left;
  var y = evt.pageY - $("#Hra").offset().top;
  //console.log(evt.pageX+','+evt.pageY);
  if (x > 0 && y > 0 && x < canvas.width && y < canvas.height) {
    if (reset) {
      startWithMoreArg(seedSeeds, velikostX, velikostY);
      reset = false;
    } else {
      x = Math.floor(x / helpX);
      y = Math.floor(y / helpY);
      console.log(
        "Left click x=" +
          x +
          ", y=" +
          y +
          ", drawArr value= " +
          drawArr[x][y] +
          ", mine valuer= " +
          mine[x][y]
      );
      //drawArr[x][y] = mine[x][y];
      if (mine[x][y] === 1) {
        //start(seedSeeds, velikost);
        lose();
        console.log("prohra");
        reset = true;
      }
      drawGrey(x, y);
    }
  }
});

document.addEventListener(
  "contextmenu",
  function(ev) {
    var x = ev.pageX - $("#Hra").offset().left;
    var y = ev.pageY - $("#Hra").offset().top;
    if (x > 0 && y > 0 && x < canvas.width && y < canvas.height) {
      ev.preventDefault();
      x = Math.floor(x / helpX);
      y = Math.floor(y / helpY);
      //console.log(x + "," + y);
      if (reset) {
        startWithMoreArg(seedSeeds, velikostX, velikostY);
        reset = false;
      } else {
        if (drawArr[x][y] === -1 || drawArr[x][y] === -3) {
          console.log(
            "right click x=" +
              x +
              ", y=" +
              y +
              ", drawArr value= " +
              drawArr[x][y] +
              ", mine valuer= " +
              mine[x][y]
          );
          mineFound(x, y);
          if (win()) {
            reset = true;
            drawArr = mine;
            console.log("WIN");
          }
        }
      }
    }
  },
  false
);

function getMinesNextTo(x, y) {
  var amunt = 0;
  if (x < velikostX - 1) {
    if (y < velikostY - 1) {
      if (mine[x + 1][y + 1] === 1) amunt++;
    }
    if (mine[x + 1][y] === 1) amunt++;
    if (y > 0) {
      if (mine[x + 1][y - 1] === 1) amunt++;
    }
  }
  if (y > 0) {
    if (mine[x][y - 1] === 1) amunt++;
  }
  if (y < velikostY - 1) {
    if (mine[x][y + 1] === 1) amunt++;
  }
  if (x > 0) {
    if (y < velikostY - 1) {
      if (mine[x - 1][y + 1] === 1) amunt++;
    }
    if (mine[x - 1][y] === 1) amunt++;
    if (y > 0) {
      if (mine[x - 1][y - 1] === 1) amunt++;
    }
  }
  return amunt;
}

function draw() {
  saveDrawArr.forEach(ele => {
    drawArr[ele.xCoord][ele.yCoord] = -3;
  });
  background(220);
  fill(0, 255, 0);
  stroke(100);
  var x = 0;
  var y = 0;
  for (x = 0; x < mine.length; x++) {
    for (y = 0; y < mine[0].length; y++) {
      switch (drawArr[x][y]) {
        case -3:
          //fill(150, 0, 0);
          image(images[2], x * helpX, y * helpY, helpX, helpY);
          break;
        case -2:
          fill(150);
          rect(x * helpX, y * helpY, (x + 1) * helpX, (y + 1) * helpY);
          break;
        case -1:
          //fill(0, 255, 0);
          image(images[0], x * helpX, y * helpY, helpX, helpY);
          break;
        case 0:
          fill(150);
          rect(x * helpX, y * helpY, (x + 1) * helpX, (y + 1) * helpY);
          break;
        case 1:
          //fill(255);
          image(images[1], x * helpX + 1, y * helpY + 1, helpX - 2, helpY - 2);
          break;
        // image(images[0],x * help, y * help,  help,  help);
      }
      //rect(x * help, y * help, (x + 1) * help, (y + 1) * help);
      //stroke(255, 0, 0);
    }
  }

  stroke(255, 0, 0);
  fill(0);
  for (x = 0; x < mine.length; x++) {
    for (y = 0; y < mine[0].length; y++) {
      if (drawArr[x][y] === -2) {
        let amunt = getMinesNextTo(x, y);
        text(
          amunt,
          x * helpX + helpX / 3.5,
          y * helpY + helpY / 5,
          (x + 1) * helpX,
          (y + 1) * helpY
        );
        if (x < velikostX - 1) {
          if (drawArr[x + 1][y] === 0) {
            x += 1;
            amunt = getMinesNextTo(x, y);
            if (amunt != 0)
              text(
                amunt,
                x * helpX + helpX / 3.5,
                y * helpY + helpY / 5,
                (x + 1) * helpX,
                (y + 1) * helpY
              );
            x -= 1;
          }
        }
        if (x > 0) {
          if (drawArr[x - 1][y] === 0) {
            x -= 1;
            amunt = getMinesNextTo(x, y);
            if (amunt != 0)
              text(
                amunt,
                x * helpX + helpX / 3.5,
                y * helpY + helpY / 5,
                (x + 1) * helpX,
                (y + 1) * helpY
              );
            x += 1;
          }
        }
        if (y < velikostY - 1) {
          if (drawArr[x][y + 1] === 0) {
            y += 1;
            amunt = getMinesNextTo(x, y);
            if (amunt != 0)
              text(
                amunt,
                x * helpX + helpX / 3.5,
                y * helpY + helpY / 5,
                (x + 1) * helpX,
                (y + 1) * helpY
              );
            y -= 1;
          }
        }
        if (y > 0) {
          if (drawArr[x][y - 1] === 0) {
            y -= 1;
            amunt = getMinesNextTo(x, y);
            if (amunt != 0)
              text(
                amunt,
                x * helpX + helpX / 3.5,
                y * helpY + helpY / 5,
                (x + 1) * helpX,
                (y + 1) * helpY
              );
            y += 1;
          }
        }
      }
    }
  }
}
