import * as THREE from 'three';

import modelUniveristy from '/3d/model-university.fbx';
import { loadSingleFBXModel } from './utils';

export class Section3 {
  async setup(group: THREE.Group) {
    const floor = new THREE.GridHelper(1.0, 10);
    floor.rotateY(0.25 * Math.PI);
    group.add(floor);

    const uniSign = await loadSingleFBXModel(modelUniveristy);
    uniSign.translateY(0.15)
    uniSign.scale.setScalar(0.1);
    uniSign.rotateY(0.75 * Math.PI);
    uniSign.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xc91e26),
      fog: true,
    });
    group.add(uniSign);
  }

  update(deltaTime: number) {

  }
}
