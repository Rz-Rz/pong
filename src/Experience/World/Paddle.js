import * as THREE from 'three';
import Experience from '../Experience.js';
import EventEmitter from '../Utils/EventEmitter.js';
import Slider from '../UI/Slider.js';
import ColorPicker from '../UI/ColorPicker.js';


export default class Paddle extends EventEmitter {

  constructor(color = 0xffffff, size = { width:6.00, height:1.00, depth:1.00 }, position = { x:0, y:-50, z:0 }) {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.width = size.width;
    this.height = size.height;
    this.depth = size.depth;
    this.color = color;
    this.position = position;
    this.movingUp = false;
    this.movingDown = false;
    this.setModel();
    this.addControls();
    this.debug();
  }

  updateGeometry() {
    // Rebuild the paddle geometry with the new size
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
}

debug() {
  const gameContainer = document.getElementById('gamecontainer');
  this.experience.world.settings.addGroup('Paddle', gameContainer);
  // Size Sliders
  const widthSlider = new Slider('Width', 1, 100, 0.1, this, 'width');
  this.experience.world.settings.addSliderToGroup('Paddle', widthSlider);

  const heightSlider = new Slider('Height', 0.5, 50, 0.1, this, 'height');
  this.experience.world.settings.addSliderToGroup('Paddle', heightSlider);

    const depthSlider = new Slider('Depth', 0.5, 50, 0.1, this, 'depth');
  this.experience.world.settings.addSliderToGroup('Paddle', depthSlider);

  // Color picker 
   const colorPicker = new ColorPicker('Color', this.color, (newColor) => {
        this.color = newColor;
        this.mesh.material.color.set(newColor);
    });
    this.experience.world.settings.addSliderToGroup('Paddle', colorPicker);
}

  setModel() {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshStandardMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.scene.add(this.mesh);
  }

  addControls() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowRight') {
        this.trigger('moveUp');
      }
      else if (event.code === 'ArrowLeft') {
        this.trigger('moveDown');
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        this.trigger('stopMove');
      }
    });

    this.on('moveUp', () => {
      this.movingUp = true;
      this.movingDown = false;
    });

    this.on('moveDown', () => {
      this.movingDown = true;
      this.movingUp = false;
    });

    this.on('stopMove', () => {
      this.movingUp = false;
      this.movingDown = false;
    });

  }

  update() {
    if (this.movingUp) {
      this.mesh.position.x += 0.15 * this.time.delta;
    }
    else if (this.movingDown) {
      this.mesh.position.x -= 0.15 * this.time.delta;
    }
    // clamp paddle position 
    const maxX = 105;
    const minX = -105;
    this.mesh.position.x = Math.min(Math.max(this.mesh.position.x, minX), maxX);
  }
}
