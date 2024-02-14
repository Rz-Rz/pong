varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vNormal = normalize(normalMatrix * normal); // Transform the normal to world space
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

