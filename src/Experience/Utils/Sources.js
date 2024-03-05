import { VITE_URL } from './Env.js';

console.log('VITE_URL =', VITE_URL);
console.log('import.meta.env =', import.meta.env);

export default [
  { name: 'desertRiverEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/desertRiver.png` },
  { name: 'oceanIslandsEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/oceanIslands.png` },
  { name: 'lushForestEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/lushForest.png` },
  { name: 'cyberpunkNeoEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/cyberpunkNeo.png` },
  { name: 'waterPalaceEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/waterPalace.png` },
  { name: 'snowySiberiaEnvMap', type: 'pngEquirectangular', path: `${VITE_URL}/textures/environmentMap/snowySiberia.png` }
]
