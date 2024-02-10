import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import Paddle from './Paddle.js';
import Ball from './Ball.js';
import SettingsMenu from '../UI/SettingsMenu.js';

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
      // this.fox = new Fox();
      this.paddle1 = new Paddle(0xffffff, { width: 30.00, height: 4.00, depth: 4.00 }, { x: 0, y: -49, z: 290 });
      this.paddle2 = new Paddle(0xffffff, { width: 30.00, height: 4.00, depth: 4.00 }, {x: 0, y: -49, z: -290});
      this.ball = new Ball();
      this.environment = new Environment();
    });
  }

  update()
  {
    if (this.fox) {
      this.fox.update();
    }
    if (this.paddle1) {
      this.paddle1.update();
    }
    if (this.ball) {
      this.ball.update();
    }
  }
}
