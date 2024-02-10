import * as THREE from 'three';
import Experience from '../Experience.js';
import Scoreboard from '../UI/Scoreboard.js';
import Slider from '../UI/Slider.js';

export default class Ball { 
constructor() {
  this.experience = new Experience();
  this.scene = this.experience.scene;
  this.time = this.experience.time;
  this.color = 0xffffff;
  this.position = { x: 0, y: -48, z: 0 };
  this.speed = 0.2;

  this.direction = Math.random() < 0.5 ? -1 : 1;
  this.velocity = { x: 0, z: this.direction * 20 };
  // this.gravity = -0.002; // Gravity effect per frame


  this.paddle1 = this.experience.world.paddle1;
  this.paddle2 = this.experience.world.paddle2;

  this.radius = 2;
  this.widthSegments = 32;
  this.heightSegments = 32;

  // Parameters for Arc Equation 
  this.customZOffset = 0;
  this.customWidth = 5000;
  this.customHeightOffset = 435;

  this.scoreboard = new Scoreboard('gamescore');
  this.setGeometry();
  this.setMaterial();
  this.setMesh();
  this.debug();
}

debug() {
  const gameContainer = document.getElementById('gamecontainer');
  this.experience.world.settings.addGroup('Ball', gameContainer);
  const ballRadiusSlider = new Slider('Ball Radius', 0.5, 2, 0.1, this, 'radius');
  this.experience.world.settings.addSliderToGroup('Ball', ballRadiusSlider);
  const ballGravitySlider = new Slider('Gravity', -0.0010, 0, 0.00001, this, 'gravity');
  this.experience.world.settings.addSliderToGroup('Ball', ballGravitySlider);

    // Slider for customZOffset
  const zOffsetSlider = new Slider('Z Offset', -1000, 1000, 1, this, 'customZOffset');
  this.experience.world.settings.addSliderToGroup('Ball', zOffsetSlider);
  
  // Slider for customWidth
  const widthSlider = new Slider('Arc Width', 0, 10000, 100, this, 'customWidth');
  this.experience.world.settings.addSliderToGroup('Ball', widthSlider);
  
  // Slider for customHeightOffset
  const heightOffsetSlider = new Slider('Height Offset', -1000, 1000, 10, this, 'customHeightOffset');
  this.experience.world.settings.addSliderToGroup('Ball', heightOffsetSlider);

}

updateGeometry() {
    // Dispose of the old geometry to prevent memory leaks
    this.mesh.geometry.dispose();
    // Create a new SphereGeometry with the updated radius
    this.mesh.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
}


setRadius(radius) {
  this.radius = radius;
  // Update the geometry 
  this.mesh.geometry.dispose(); // Clean up the old geometry 
  this.setGeometry(); // Create the new geometry
}

setGeometry() {
  this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
}

setMaterial() {
  this.material = new THREE.MeshStandardMaterial({ color: this.color });
}

setMesh() {
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.scene.add(this.mesh);
}

update()
{
  this.checkBorderCollision();
  this.mesh.position.x += this.velocity.x * this.time.delta * this.speed;
  this.mesh.position.z += this.velocity.z * this.time.delta * this.speed;
  //Apply gravity to vertical velocity 
  this.mesh.position.y = -((this.mesh.position.z - 0) * (this.mesh.position.z - 0) / 2100) + -10;
  this.processCpuPaddle();
  if (this.isPastPaddle1()) {
    console.log("past paddle 1");
    this.scoreboard.updateScore('player2', 1);
    this.stopBall();
    setTimeout(() => {
      this.resetBall();
    }, 1000);
  }
  if (this.isPastPaddle2()) {
    console.log("past paddle 2");
    this.scoreboard.updateScore('player', 1);
    this.stopBall();
    setTimeout(() => {
      this.resetBall();
    }, 1000);
  }
}

stopBall() {
  this.velocity.x = 0;
  this.velocity.z = 0;
}

resetBall() {
  this.mesh.position.set(this.position.x, 1, this.position.z);
  let direction = Math.random() < 0.5 ? -1 : 1;
  this.velocity.x = 0;
  this.velocity.y = 0;
  this.velocity.z = direction * 2;
}


isSideCollision() {
  let ballX = this.mesh.position.x;
  let halfFieldWidth = this.experience.world.floor.fieldWidth / 2;
  return ballX - this.radius <= -halfFieldWidth || ballX + this.radius >= halfFieldWidth;
    
}

isBallAlignedWithPaddle(paddle) {
  let halfPaddleWidth = paddle.width / 2;
  let paddleX = paddle.mesh.position.x;
  let ballX = this.mesh.position.x;
  return ballX > paddleX - halfPaddleWidth && ballX < paddleX + halfPaddleWidth;
}

hitBall(paddle) {
  this.velocity.x = (this.mesh.position.x - paddle.mesh.position.x) / 5;
  this.velocity.z *= -1;
  this.velocity.y = 0.28;
}

paddle2Collision() {
  return this.mesh.position.z - this.radius <= this.paddle2.mesh.position.z && this.isBallAlignedWithPaddle(this.paddle2);
}

paddle1Collision() {
  return this.mesh.position.z + this.radius >= this.paddle1.mesh.position.z && this.isBallAlignedWithPaddle(this.paddle1);
}

processCpuPaddle() {
    if (this.mesh.position.x >= this.paddle2.mesh.position.x) {
      this.paddle2.mesh.position.x += Math.min(Math.abs(this.paddle2.mesh.position.x - this.mesh.position.x, 0.5));
    }
    else if (this.mesh.position.x <= this.paddle2.mesh.position.x) {
      this.paddle2.mesh.position.x -= Math.min(Math.abs(this.paddle2.mesh.position.x - this.mesh.position.x, 0.5));
    }
}

isPastPaddle1() {
  return this.mesh.position.z > this.paddle1.mesh.position.z;
}

isPastPaddle2() {
return this.mesh.position.z < this.paddle2.mesh.position.z;
}

checkBorderCollision() {
  // Collision with vertical borders
  if (this.isSideCollision()) {
    console.log("collision");
    this.velocity.x *= -1; // Invert X velocity
  }
  if (this.paddle1Collision()) {
  this.mesh.position.z = this.paddle1.mesh.position.z - this.radius;
    this.hitBall(this.paddle1);
  }
  if (this.paddle2Collision()) {
  this.mesh.position.z = this.paddle2.mesh.position.z + this.radius;
    this.hitBall(this.paddle2);
  }
}
}
