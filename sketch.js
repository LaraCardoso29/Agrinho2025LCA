let farmer;
let corns = [];
let truck;
let collectedCorn = 0;
let dropOffPoint;
let house;

let cow;
let cowDirection = 1;

let cow2;
let cow2Direction = 1;

let pig1;
let pig2;
let pigJumpAmplitude = 10;
let pigJumpSpeed = 0.1;

let grassTiles = [];
let soilBlock = { x: 250, y: 300, w: 120, h: 100 };
let soilGrassTiles = [];

let deliveriesMade = 0; // contador de entregas

let gameState = 'start'; // 'start' | 'playing'
let startTime;

function setup() {
  createCanvas(600, 450);
  textAlign(CENTER, CENTER);
  startTime = millis();

  farmer = createVector(width / 2, height / 2);
  dropOffPoint = createVector(300, height - 300);
  spawnCorn();
  truck = null;
  cow = createVector(100, height - 64);
  cow2 = createVector(520, 100);
  house = createVector(20, height - 175);

  pig1 = createVector(160, 200);
  pig2 = createVector(220, 240);

  for (let x = 16; x < width; x += 15) {
    for (let y = 16; y < height; y += 15) {
      grassTiles.push({
        x: x + random(-3, 3),
        y: y + random(-3, 3),
      });
    }
  }

  for (let x = soilBlock.x + 5; x < soilBlock.x + soilBlock.w - 5; x += 15) {
    for (let y = soilBlock.y + 5; y < soilBlock.y + soilBlock.h - 5; y += 15) {
      soilGrassTiles.push({
        x: x + random(-2, 2),
        y: y + random(-2, 2),
      });
    }
  }
}

function draw() {
  if (gameState === 'start') {
    drawStartScreen();
    if (millis() - startTime > 4000) {
      gameState = 'playing';
    }
    return;
  }

  background(110, 180, 110);
  drawGrassTexture(grassTiles);
  drawSoilBlock();
  drawHouse();
  drawRoad();
  drawCow();
  drawCow2();
  drawPigs();
  drawTractors();

  textSize(30);
  fill(0);
  for (let x = 0; x < width; x += 32) {
    text('🌳', x, 0);
    text('🌳', x, height - 32);
  }
  for (let y = 32; y < height - 32; y += 32) {
    text('🌳', 0, y);
    text('🌳', width - 32, y);
  }

  textSize(29);
  fill(0);
  text('📮', dropOffPoint.x, dropOffPoint.y);

  textSize(27);
  text('👨‍🌾', farmer.x, farmer.y);

  if (!truck) {
    textSize(21);
    fill(0);
    for (let i = corns.length - 1; i >= 0; i--) {
      let corn = corns[i];
      text('🌽', corn.x, corn.y);
      if (dist(farmer.x, farmer.y, corn.x, corn.y) < 25) {
        corns.splice(i, 1);
        collectedCorn++;
      }
    }
  }

  if (truck) {
    textSize(32);
    text('🚚', truck.x, truck.y);

    if (truck.phase === 0) {
      truck.y += 2;
      if (truck.y >= 100) {
        truck.phase = 1;
      }
    } else if (truck.phase === 1) {
      truck.x -= 2;
      if (truck.x <= 300) {
        truck.phase = 2;
      }
    } else if (truck.phase === 2) {
      truck.y -= 2;
      if (truck.y <= -220) {
        truck = null;
        spawnCorn();
      }
    }
  }

  if (collectedCorn > 0 && dist(farmer.x, farmer.y, dropOffPoint.x, dropOffPoint.y) < 40) {
    deliveriesMade++;
    collectedCorn = 0;
    spawnTruck();
  }

  fill(170, 240, 170);
  noStroke();
  rect(41, 39, 190, 44, 6);

  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text('Milhos na mochila: ' + collectedCorn, 45, 40);
  text('Entregas feitas: ' + deliveriesMade, 45, 65);

  noFill();
  stroke(139, 69, 19);
  strokeWeight(3);
  let coopX = 40;
  let coopY = 110;
  let coopW = 150;
  let coopH = 70;
  rect(coopX, coopY, coopW, coopH, 8);

  noStroke();
  fill(0);
  textSize(24);
  let chickenSpacingX = 40;
  let chickenSpacingY = 30;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      text('🐓', coopX + 20 + i * chickenSpacingX, coopY + 9 + j * chickenSpacingY);
    }
  }
}

function drawStartScreen() {
  background(90, 150, 90);
  fill(255);
  textSize(40);
  text("🌽 Fazenda da Lara 🌽", width / 2, height / 2 - 40);
  textSize(24);
  text("Prepare-se...", width / 2, height / 2 + 10);
  text("Colete 🌽 e coloque na 📮!", width / 2, height / 2 + 40);
}

function drawGrassTexture(tileArray) {
  noStroke();
  fill(50, 130, 50, 180);
  for (let tile of tileArray) {
    push();
    translate(tile.x, tile.y);
    for (let i = 0; i < 3; i++) {
      rotate(PI / 6 * (i - 1));
      rect(0, 0, 2, 10, 2);
    }
    pop();
  }
}

function drawTractors() {
  textSize(26);
  for (let i = 0; i < 4; i++) {
    let x = 520 + sin(frameCount * 90 + i) * 1;
    let y = 60 + i * 30;
    text('🚜', x, y + 100);
  }
}

function drawSoilBlock() {
  fill(139, 69, 1);
  noStroke();
  rect(soilBlock.x, soilBlock.y, soilBlock.w, soilBlock.h, 6);
  drawGrassTexture(soilGrassTiles);
}

function drawHouse() {
  textSize(140);
  fill(0);
  text('🏠', house.x, house.y);
}

function drawCow() {
  cow.x += cowDirection * 1.3;
  if (cow.x > width - 100 || cow.x < 100) {
    cowDirection *= -1;
  }
  textSize(32);
  fill(0);
  text('🐄', cow.x, cow.y);
}

function drawCow2() {
  cow2.y += cow2Direction * 0.3;
  if (cow2.y > height + 50) {
    cow2.y = -30;
  }
  textSize(32);
  fill(0);
  text('🐄', cow2.x - 67, cow2.y + 58);
}

function drawPigs() {
  let jump1 = sin(frameCount * 0.15) * pigJumpAmplitude;
  let jump2 = cos(frameCount * 0.15) * pigJumpAmplitude;
  textSize(28);
  fill(0);
  text('🐖', pig1.x, pig1.y - jump1);
  text('🐖', pig2.x, pig2.y - jump2);
}

function handleMovement() {
  if (keyIsDown(LEFT_ARROW)) farmer.x -= 20;
  if (keyIsDown(RIGHT_ARROW)) farmer.x += 20;
  if (keyIsDown(UP_ARROW)) farmer.y -= 20;
  if (keyIsDown(DOWN_ARROW)) farmer.y += 20;
}

function keyPressed() {
  handleMovement();
}

function drawRoad() {
  fill(60);
  noStroke();
  rect(300, 100, 300, 40, 6);
  rect(300, 14, 40, 100, 6);

  fill(255, 204, 0);
  for (let i = 0; i < 5; i++) {
    rect(330 + i * 50, 117, 20, 5);
  }
}

function spawnCorn() {
  corns = [];
  let startX = 260;
  let spacingX = 35;
  let topY = 310;
  let bottomY = 360;

  for (let i = 0; i < 3; i++) {
    corns.push(createVector(startX + i * spacingX, topY));
  }
  for (let i = 0; i < 3; i++) {
    corns.push(createVector(startX + i * spacingX, bottomY));
  }
}

function spawnTruck() {
  truck = {
    x: 620,
    y: 70,
    phase: 0
  };
}
