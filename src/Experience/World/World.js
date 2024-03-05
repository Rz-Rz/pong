import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Paddle from './Paddle.js';
import Ball from './Ball.js';
import SettingsMenu from '../UI/SettingsMenu.js';
import Wall from './Wall.js';

export default class World 
{
  constructor() 
  {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;
    // Wait for resources 
    this.resources.on('ready', () => {
      this.settings = new SettingsMenu();
      this.floor = new Floor();
      this.paddle1 = new Paddle(0xffffff, { width: 30.00, height: 4.00, depth: 4.00 }, { x: 0, y: -49, z: 290 });
      this.paddle2 = new Paddle(0xffffff, { width: 30.00, height: 4.00, depth: 4.00 }, {x: 0, y: -49, z: -290});
      this.environment = new Environment();
      this.createWalls();
      this.ball = new Ball();
    });
  }

  createWalls() {
        const wallThickness = 10; // Define the thickness of the walls
        const wallHeight = 100; // Adjust based on your game's needs
        const playAreaWidth = 240; // Example width, adjust to match your game

        // Create left wall
        this.leftWall = new Wall(
            { x: -(playAreaWidth / 2 + wallThickness / 2), y: 0, z: 0 },
            { width: wallThickness, height: wallHeight, depth: 600 } // Depth to match the play area
        );

        // Create right wall
        this.rightWall = new Wall(
            { x: playAreaWidth / 2 + wallThickness / 2, y: 0, z: 0 },
            { width: wallThickness, height: wallHeight, depth: 600 }
        );
    }

  update()
  {
    if (this.paddle1) {
      this.paddle1.update();
    }
    if (this.ball) {
      this.ball.update();
    }
  }
}
