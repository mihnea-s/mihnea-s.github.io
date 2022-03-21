import * as THREE from 'three';

export type SiteColor = {
  dark: THREE.Color,
  light: THREE.Color,
};

export function randomPastelColour(): SiteColor {
  const hue = Math.random();

  const saturation = Math.random() * 0.31 + 0.33;

  const lightness = {
    dark: Math.random() * 0.27 + 0.18,
    light: Math.random() * 0.06 + 0.79,
  };

  const color = {
    dark: new THREE.Color(),
    light: new THREE.Color(),
  };

  color.dark.setHSL(hue, saturation, lightness.dark);
  color.light.setHSL(hue, saturation, lightness.light);

  return color;
}

export function randomGeometry(): THREE.BufferGeometry {
  const geoms = [
    THREE.BoxGeometry,
    THREE.ConeGeometry,
    THREE.DodecahedronGeometry,
    THREE.TorusGeometry,
    THREE.CylinderGeometry,
    THREE.SphereGeometry,
  ];

  return new geoms[Math.floor(Math.random() * geoms.length)];
}
