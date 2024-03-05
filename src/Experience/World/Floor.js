import * as THREE from 'three';
import Experience from '../Experience.js';
import Slider from '../UI/Slider.js';
import ColorPicker from '../UI/ColorPicker.js';

export default class Floor 
{
  constructor() 
  {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.fieldWidth = 240;
    this.fieldLength = 600;
    this.color = 0xffffff;

    this.setGeometry(); 
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.debug();
  }

  setGeometry() 
  {
    this.geometry = new THREE.PlaneGeometry(this.fieldWidth, this.fieldLength);
  }

  debug() {
    const gameContainer = document.getElementById('gamecontainer');
    this.experience.world.settings.addGroup('Floor', gameContainer);

    // Material property sliders
    const metalnessSlider = new Slider('Metalness', 0, 1, 0.01, this.material, 'metalness');
    this.experience.world.settings.addSliderToGroup('Floor', metalnessSlider);

    const roughnessSlider = new Slider('Roughness', 0, 1, 0.01, this.material, 'roughness');
    this.experience.world.settings.addSliderToGroup('Floor', roughnessSlider);

    const transmissionSlider = new Slider('Transmission', 0, 1, 0.01, this.material, 'transmission');
    this.experience.world.settings.addSliderToGroup('Floor', transmissionSlider);

    const reflectivitySlider = new Slider('Reflectivity', 0, 1, 0.01, this.material, 'reflectivity');
    this.experience.world.settings.addSliderToGroup('Floor', reflectivitySlider);

    const clearcoatSlider = new Slider('Clearcoat', 0, 1, 0.01, this.material, 'clearcoat');
    this.experience.world.settings.addSliderToGroup('Floor', clearcoatSlider);

    const clearcoatRoughnessSlider = new Slider('Clearcoat Roughness', 0, 1, 0.01, this.material, 'clearcoatRoughness');
    this.experience.world.settings.addSliderToGroup('Floor', clearcoatRoughnessSlider);

    const opacitySlider = new Slider('Opacity', 0, 1, 0.01, this.material, 'opacity');
    this.experience.world.settings.addSliderToGroup('Floor', opacitySlider);

      // Color picker 
   const colorPicker = new ColorPicker('Color', this.color, (newColor) => {
        this.color = newColor;
        this.mesh.material.color.set(newColor);
    });
    this.experience.world.settings.addSliderToGroup('Floor', colorPicker);
  }

  setTextures()
  {
    this.textures = {}; 
  }

  setMaterial()
  {
    this.material = new THREE.MeshPhysicalMaterial({
      metalness: 0.1, // Slight metalness can help simulate reflective surfaces
      roughness: 0, // Lower roughness for a smoother surface
      transmission: 0.9, // High transmission for glass-like transparency
      reflectivity: 0.9, // Adjust reflectivity as needed
      clearcoat: 1.0, // A clear coat can add an additional reflective layer
      clearcoatRoughness: 0.1, // Keep clearcoat roughness low for smooth glass
      opacity: 0.5, // Adjust opacity for more or less transparency
      transparent: true, // Enable transparency
      color: this.color, // Adjust the color as needed, white for clear glass
      side: THREE.DoubleSide, // Make the material double-sided
    });
  }

  setMesh()
  {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = - Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(0, -50, 0);
    this.scene.add(this.mesh);
  }
}
