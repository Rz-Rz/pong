import * as THREE from 'three';
import Experience from '../Experience.js';
import SelectionMenu from '../UI/SelectionMenu.js';
import { VITE_URL } from '../Utils/Env.js';


export default class Environment 
{
  constructor()
  {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;
    if (this.debug.active) 
    {
      this.debugFolder = this.debug.ui.addFolder('environment');
    }
    this.setSunLight();
    this.setEnvironmentMap();

    document.getElementById('toggleMapsButton').addEventListener('click', function() {
    const uiMaps = document.getElementById('uiMaps') // Show the maps UI
      // uiMaps.style.display = 'block';
      uiMaps.classList.add('open');
});

document.getElementById('closeMapSelection').addEventListener('click', function() {
  const uiMaps = document.getElementById('uiMaps') // Hide the maps UI
  uiMaps.classList.remove('open');

});

    const selectionMenu = new SelectionMenu([
      { name: 'Desert River', mapName: 'desertRiverEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/desertRiver.png` },
      { name: 'Ocean Island', mapName: 'oceanIslandsEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/oceanIslands.png` },
      { name: 'Lush Forest', mapName: 'lushForestEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/lushForest.png` },
      { name: 'Cyberpunk Neo', mapName: 'cyberpunkNeoEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/cyberpunkNeo.png` },
      { name: 'Snowy Landscape', mapName: 'snowySiberiaEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/snowySiberia.png` },
      { name: 'Water Palace', mapName: 'waterPalaceEnvMap', type: 'envMap', thumbnail: `${VITE_URL}/textures/environmentMap/waterPalace.png` }
    ], (option) => {
      if (option.type === 'envMap') {
        this.changeEnvironmentMap(option.mapName);
      } else if (option.type === 'shader') {
        this.applyShader(option.shaderCode);
      }
  });
    selectionMenu.attachTo(document.getElementById('uiMaps'));
}

  setSunLight() 
  {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15; 
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    if(this.debug.active)
    {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(- 5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(- 5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(- 5)
        .max(5)
        .step(0.001)
    }
  }

  changeEnvironmentMap(mapName) {
    const newEnvMap = this.resources.items[mapName];
    if (!newEnvMap) {
      console.error(`Environment map ${mapName} not found`);
      return;
    }
    this.environmentMap.texture = newEnvMap;
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;
    this.scene.background = this.environmentMap.texture;
    this.environmentMap.updateMaterials();
    console.log(`Environment map changed to ${mapName}`);
  }

  setEnvironmentMap()
  {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.9;
    this.environmentMap.texture = this.resources.items.desertRiverEnvMap;
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;
    this.scene.background = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => 
    {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) 
        {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    this.environmentMap.updateMaterials();
    //debug 
    if (this.debug.active) 
    {
      this.debugFolder 
      .add(this.environmentMap, 'intensity')
      .name('envMapIntensity')
      .min(0)
      .max(4)
      .step(0.001)
      .onChange(this.environmentMap.updateMaterials);
    }
  }
}
