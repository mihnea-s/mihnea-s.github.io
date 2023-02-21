import * as THREE from 'three';

import modelRook from '/3d/model-rook.fbx';
import modelLambda from '/3d/model-lambda.fbx';
import modelGameboy from '/3d/model-gameboy.fbx';
import modelBackdrop from '/3d/model-backdrop.fbx';
import { loadSingleFBXModel } from './utils';

export class Section4 {
  async setup(group: THREE.Group) {
    const backdrop = await loadSingleFBXModel(modelBackdrop);
    backdrop.scale.setScalar(0.0085);
    backdrop.rotateY(1.25 * Math.PI);
    backdrop.material = new THREE.ShadowMaterial();
    group.add(backdrop);

    const rook = await loadSingleFBXModel(modelRook);
    rook.translateX(0.15);
    rook.translateY(0.35);
    rook.translateZ(-0.25);
    rook.rotateY(0.5 * Math.PI);
    rook.scale.setScalar(0.1);
    rook.material = new THREE.MeshPhongMaterial({
      color: 0x1446a0,
      emissive: 0x1446a0,
    });
    group.add(rook);

    const gameboy = await loadSingleFBXModel(modelGameboy);
    gameboy.translateY(0.15);
    gameboy.translateZ(+0.00);
    gameboy.rotateY(0.75 * Math.PI);
    gameboy.scale.setScalar(0.1);
    gameboy.material = new THREE.MeshPhongMaterial({
      color: 0x7cbe8a,
      emissive: 0x7cbe8a,
    });
    group.add(gameboy);

    const lambda = await loadSingleFBXModel(modelLambda);
    lambda.translateX(- 0.15);
    lambda.translateY(-0.05);
    lambda.translateZ(+0.25);
    lambda.rotateY(0.75 * Math.PI);
    lambda.scale.setScalar(0.1);
    lambda.material = new THREE.MeshPhongMaterial({
      color: 0xdb3069,
      emissive: 0xdb3069,
    });
    group.add(lambda);

    const lamp = new THREE.SpotLight();
    // const geometry = new THREE.SphereGeometry(0.25, 32, 16);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // const lamp = new THREE.Mesh(geometry, material);
    lamp.translateY(0.75);
    lamp.rotateZ(-Math.PI / 4);
    group.add(lamp);
  }

  update(deltaTime: number) {

  }
}
