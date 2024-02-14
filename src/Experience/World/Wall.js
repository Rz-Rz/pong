import * as THREE from 'three';
import Experience from '../Experience.js';
import Slider from '../UI/Slider.js';
import shockwaveVertexShader from '../Shaders/Shockwave/vertex.glsl';
import shockwaveFragmentShader from '../Shaders/Shockwave/fragment.glsl';

export default class Wall {
    constructor(position, size) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.position = position;
        this.size = size;
        
        this.initMesh();
      this.debug();
    }

  debug () {
  const gameContainer = document.getElementById('gamecontainer');
  this.experience.world.settings.addGroup('Shaders', gameContainer);

  const shaderRefractionRatio = new Slider ('Refraction Ratio', 0, 4, 0.01, this.material.uniforms.refractionRatio, 'value');
  this.experience.world.settings.addSliderToGroup('Shaders', shaderRefractionRatio);

  const shaderReflectivity = new Slider ('Reflectivity', 0, 1, 0.01, this.material.uniforms.reflectivity, 'value');
  this.experience.world.settings.addSliderToGroup('Shaders', shaderReflectivity);
  }

  initMesh() {
    const geometry = new THREE.BoxGeometry(this.size.width, this.size.height, this.size.depth);
    // const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const material = new THREE.ShaderMaterial({
      uniforms: { 
        refractionRatio: { value: 0.94 }, // Experiment with this value
        reflectivity: { value: 0.1 }, // Experiment with this value
        // envMap: { value: this.experience.world.environment.environmentMap.texture },
      },
      vertexShader: shockwaveVertexShader,
      fragmentShader: shockwaveFragmentShader,
      transparent: true
    });
    this.material = material;
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.scene.add(this.mesh);
  }
}

