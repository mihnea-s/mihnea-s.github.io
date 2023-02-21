import * as THREE from 'three';

import modelJS from '/3d/model-js.fbx';
import modelGo from '/3d/model-go.fbx';
import modelCxx from '/3d/model-cxx.fbx';
import modelBackdrop from '/3d/model-backdrop.fbx';

import { loadSingleFBXModel } from './utils';

export class Section2 {
  async setup(group: THREE.Group) {
    const backdrop = await loadSingleFBXModel(modelBackdrop);
    backdrop.scale.setScalar(0.0085);
    backdrop.rotateY(-0.25 * Math.PI);
    backdrop.receiveShadow = true;
    backdrop.material = new THREE.ShadowMaterial();
    group.add(backdrop);

    const cxx = await loadSingleFBXModel(modelCxx);
    cxx.scale.setScalar(0.045);
    cxx.translateX(-0.5);
    cxx.translateY(0.6);
    cxx.rotateY(Math.PI);
    cxx.castShadow = true;
    cxx.material = new THREE.MeshStandardMaterial({ color: 0x0f40e0 });
    group.add(cxx);

    const js = await loadSingleFBXModel(modelJS);
    js.scale.setScalar(0.033);
    js.translateX(0.3);
    js.translateY(0.3);
    js.rotateY(Math.PI);
    js.castShadow = true;
    js.material = new THREE.MeshStandardMaterial({ color: 0xe0d005 });
    group.add(js);

    const go = await loadSingleFBXModel(modelGo);
    go.scale.setScalar(0.025);
    go.translateX(-0.1);
    go.translateZ(0.1);
    go.rotateY(Math.PI);
    go.castShadow = true;
    go.material = new THREE.MeshStandardMaterial({ color: 0x4f80e0 });
    group.add(go);

    const dirlight = new THREE.DirectionalLight(0xffffff, 3.0);
    dirlight.position.set(0.0, 0.8, 0.0);
    group.add(dirlight);

    const ambilight = new THREE.AmbientLight(0xffffff, 0.7);
    group.add(ambilight);
  }

  update(deltaTime: number) {

  }
}
