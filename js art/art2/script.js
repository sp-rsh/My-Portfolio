let fr;
let angle = 0;
let numParticles = 10; // パーティクルの数
let lissajousCurves = []; // リサージュ曲線を格納する配列
let frameParticles = []; // フレームを表示するパーティクルを格納する配列
const frameWidth = 20; // フレームの幅

class LissajousCurve {
  constructor(index) {
    this.index = index;
    this.size = 130;
    this.detail = 360;
    this.hue = random(100, 250);
    this.saturation = random(100, 250);
    this.brightness = 255;
    this.yoff = random(-0.1, 0.1);
  }

  display() {
    let thetaOffset = TWO_PI / numParticles * this.index;
    beginShape(POINTS);
    for (let theta = 0; theta < TWO_PI * 7; theta += TWO_PI / this.detail) {
      let radius = this.size * cos(5 * theta); // 曲線の半径計算
      let x = radius * cos(theta + this.yoff);
      let y = radius * sin(theta + this.yoff);
      let z = this.size * sin(theta + this.yoff); 

      stroke(this.hue, this.saturation, this.brightness, 150);
      strokeWeight(1.5);
      vertex(x, y, z);
    }
    endShape();
  }
}

class FrameParticle {
  constructor() {
    this.setPosition();
    this.size = random(1, 3); // パーティクルのサイズ
    this.speed = random(0.05, 0.2); // 動きを少し遅くする
    this.angle = random(TWO_PI);
    this.brightness = random(20, 100); // 明るさにバリエーションを追加
    this.lineLength = random(10, 30); // lineの長さ 
  }
  
  setPosition() {
    let side = floor(random(4));
    let offset = random(frameWidth);
    switch(side) {
      case 0: // Top
        this.pos = createVector(random(-width/2, width/2), -height/2 + offset);
        break;
      case 1: // Right
        this.pos = createVector(width/2 - offset, random(-height/2, height/2));
        break;
      case 2: // Bottom
        this.pos = createVector(random(-width/2, width/2), height/2 - offset);
        break;
      case 3: // Left
        this.pos = createVector(-width/2 + offset, random(-height/2, height/2));
        break;
    }
    this.origin = this.pos.copy();
  }
  
  update() {
    this.angle += this.speed;
    let offset = sin(this.angle) * 2; // 揺れの幅を小さくする
    if (this.origin.x <= -width/2 + frameWidth || this.origin.x >= width/2 - frameWidth) {
      this.pos.y = this.origin.y + offset;
    } else {
      this.pos.x = this.origin.x + offset;
    }
  }
  
  display() {
    noStroke();
    fill(45, 100, this.brightness, 0.8); // Gold color with varying brightness
    ellipse(this.pos.x, this.pos.y, this.size);
    
    // lineを描画
    stroke(45, 100, this.brightness, 0.8); // Gold color with varying brightness
    let halfLength = this.lineLength / 2;
    if (this.origin.x <= -width/2 + frameWidth || this.origin.x >= width/2 - frameWidth) {
      // lineを縦に配置
      line(this.pos.x, this.pos.y - halfLength, this.pos.x, this.pos.y + halfLength);
    } else {
      // lineを横に配置
      line(this.pos.x - halfLength, this.pos.y, this.pos.x + halfLength, this.pos.y);
    }
  }
}

function setup() {
  createCanvas(500, 500, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  fr = createLoop({ duration: 8, gif: true });

  // リサージュ曲線の生成
  for (let i = 0; i < numParticles; i++) {
    lissajousCurves.push(new LissajousCurve(i));
  }

  // フレームの各辺にパーティクルを配置
  for (let i = 0; i < 800; i++) { // パーティクル数を増やす
    frameParticles.push(new FrameParticle());
  }
}

function draw() {
  background(0);
  blendMode(ADD); // ブレンドモードをADDに設定
  
  // フレームのパーティクルを表示
  push();
  for (let frameParticle of frameParticles) {
    frameParticle.update();
    frameParticle.display();
  }
  pop();
  
  rotateX(angle * 0.8);
  rotateY(angle * 0.3);
  rotateZ(angle * 1.5);

  // リサージュ曲線の表示と円形配置
  for (let i = 0; i < lissajousCurves.length; i++) {
    let angleOffset = TWO_PI / numParticles * i;
    push();
    rotateZ(angleOffset);
    lissajousCurves[i].display();
    pop();
  }

  angle += 0.008; // アニメーションの速度を調整
}

// マウスクリックでフレームのパーティクルをリセット
function mousePressed() {
  frameParticles = [];
  for (let i = 0; i < 800; i++) {
    frameParticles.push(new FrameParticle());
  }
}