uniform samplerCube envMap; // The environment map
uniform float refractionRatio; // Refraction ratio of the material, glass typically has values between 1.0 and 1.5
uniform float reflectivity; // Reflectivity of the material

varying vec3 vWorldPosition;
varying vec3 vNormal;


void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition); // Direction from camera to vertex
  vec3 refractDir = refract(viewDirection, vNormal, refractionRatio);
  // vec4 envColor = textureCube(envMap, refractDir);
  vec4 envColor = textureCube(envMap, vec3(refractDir.x, -refractDir.y, refractDir.z));
  
  // Mix the environment color with some reflectivity
  vec3 reflectDir = reflect(viewDirection, vNormal);
  vec4 reflectColor = textureCube(envMap, reflectDir);
  envColor = mix(envColor, reflectColor, reflectivity);
  
  // Adjust the color's alpha to control the transparency
  gl_FragColor = vec4(envColor.rgb, 0.5); // Set alpha to 0.5 for 50% transparency
}

