import * as THREE from 'three';

export class Section1 {
  private static ROOM_SIZE = 0.5;
  private static QUART_DIAGONAL = 0.25 * this.ROOM_SIZE * Math.SQRT2;

  private wall1Mat?: THREE.MeshStandardMaterial;
  private wall1Light?: THREE.RectAreaLight;
  private wall2Mat?: THREE.MeshStandardMaterial;
  private wall2Light?: THREE.RectAreaLight;

  async setup(group: THREE.Group) {
    const floorGeom = new THREE.PlaneGeometry(Section1.ROOM_SIZE, Section1.ROOM_SIZE);
    const floorMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(1.0, 1.0, 1.0), });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotateX(-0.5 * Math.PI);
    floor.rotateZ(0.25 * Math.PI);
    group.add(floor);

    const wall1Geom = new THREE.PlaneGeometry(0.5, 0.5);
    this.wall1Mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(1.0, 0.0, 0.0) });
    const wall1 = new THREE.Mesh(wall1Geom, this.wall1Mat);
    wall1.translateX(Section1.QUART_DIAGONAL);
    wall1.translateY(Section1.ROOM_SIZE / 2)
    wall1.translateZ(Section1.QUART_DIAGONAL);
    wall1.rotateY(1.25 * Math.PI);
    group.add(wall1);

    const wall2Geom = new THREE.PlaneGeometry(0.5, 0.5);
    this.wall2Mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.0, 1.0, 0.0) });
    const wall2 = new THREE.Mesh(wall2Geom, this.wall2Mat);
    wall2.translateX(Section1.QUART_DIAGONAL);
    wall2.translateY(Section1.ROOM_SIZE / 2)
    wall2.translateZ(-Section1.QUART_DIAGONAL);
    wall2.rotateY(-0.25 * Math.PI);
    group.add(wall2);

    const box1Goem = new THREE.BoxGeometry(0.20, 0.35, 0.20);
    const box1Mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.94, 0.95, 0.95) });
    const box1 = new THREE.Mesh(box1Goem, box1Mat);
    box1.translateZ(-Section1.QUART_DIAGONAL / 1.33);
    box1.translateY(0.35 / 2.0);
    group.add(box1);

    const box2Goem = new THREE.BoxGeometry(0.20, 0.25, 0.20);
    const box2Mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.94, 0.95, 0.95) });
    const box2 = new THREE.Mesh(box2Goem, box2Mat);
    box2.translateZ(Section1.QUART_DIAGONAL / 1.33);
    box2.translateY(0.25 / 2.0);
    box2.rotateY(-Math.PI / 3);
    group.add(box2);

    const amLight = new THREE.AmbientLight(0x1f1f10);
    group.add(amLight);

    const light = new THREE.RectAreaLight(0xffffff, 2.0, Section1.ROOM_SIZE, Section1.ROOM_SIZE);
    light.translateY(Section1.ROOM_SIZE);
    light.lookAt(0, 0, 0);
    group.add(light);

    this.wall1Light = new THREE.RectAreaLight(0xff0000, 0.4, Section1.ROOM_SIZE, Section1.ROOM_SIZE);
    this.wall1Light.translateX(Section1.QUART_DIAGONAL);
    this.wall1Light.translateZ(Section1.QUART_DIAGONAL);
    this.wall1Light.rotateY(1.25 * Math.PI);
    this.wall1Light.lookAt(0, 0, 0);
    group.add(this.wall1Light);

    this.wall2Light = new THREE.RectAreaLight(0x00ff00, 0.4, Section1.ROOM_SIZE, Section1.ROOM_SIZE);
    this.wall2Light.translateX(Section1.QUART_DIAGONAL);
    this.wall2Light.translateZ(-Section1.QUART_DIAGONAL);
    this.wall2Light.rotateY(-0.25 * Math.PI);
    this.wall2Light.lookAt(0, 0, 0);
    group.add(this.wall2Light);
  }

  update(time: number, _: number) {
    const x = 10e-5 * time;

    const c1 = new THREE.Color(1.0, 0.0, Math.sin(x));
    this.wall1Mat!.color = c1;
    this.wall1Light!.color = c1;

    const c2 = new THREE.Color(0.0, 1.0, Math.cos(x));
    this.wall2Mat!.color = c2
    this.wall2Light!.color = c2;
  }
}
