import * as THREE from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import modelRook from '/static/model-rook.fbx';
import modelLambda from '/static/model-lambda.fbx';
import modelGameboy from '/static/model-gameboy.fbx';
import modelBackdrop from '/static/model-backdrop.fbx';
import modelUniveristy from '/static/model-university.fbx';

import solidVertex from '/shader/solid.vert.glsl';
import solidFragment from '/shader/solid.frag.glsl';
import gridVertex from '/shader/grid.vert.glsl';
import gridFragment from '/shader/grid.frag.glsl';
import backgroundVertex from '/shader/background.vert.glsl';
import backgroundFragment from '/shader/background.frag.glsl';

console.log(
  "%cHello!\n%cThis site is open-source: https://github.com/mihnea-s/mihnea-s.github.io",
  "font-size:4rem;color:aquamarine;background-color:rgb(31,41,51);",
  "font-size:2rem;color:azure;background-color:rgb(31,41,51);"
)

// Deal with email href
window.addEventListener('load', _ => {
  const ord = (x: string) => x.charCodeAt(0);

  const rot13 = (value: string): string => {
    return value.replace(/[a-z]/g, (c: string): string => String.fromCharCode(
      ord(c) < ord('n')
        ? ord(c) + 13
        : ord('a') + ord(c) - ord('n')
    ));
  };

  Array.from(document.getElementsByClassName('href-rot13'))
    .filter(el => el instanceof HTMLAnchorElement)
    .map(el => el as HTMLAnchorElement)
    .forEach(el => {
      el.href = rot13(el.href)
      el.setAttribute('href-print', rot13(el.getAttribute('href-print') ?? ''));
    });
});

class Portfolio {
  static DISTANCE = 2.0 as const;
  static POSSIBLE_LANGUAGES = ['en', 'ro'] as const;

  private scene: THREE.Scene;
  private loader: FBXLoader;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private time: number = 0.0;
  private scroll: number = 0.0;

  // private fractalMesh!: THREE.Mesh;

  private solidShader!: THREE.ShaderMaterial;
  private gridShader!: THREE.ShaderMaterial;

  private group1: THREE.Group;
  private group2: THREE.Group;
  private group3: THREE.Group;
  private group4: THREE.Group;

  private updateTime(timestamp: number) {
    this.time = timestamp;

    // Update uniforms
    // this.fractalShader.uniforms['u_time'].value = timestamp;
    // this.backgroundShader.uniforms['u_time'].value = timestamp;
  }

  private lagrange(x: number) {
    const l1c = 27 / 2;
    const l2c = 27 / 6;

    const l1 = l1c * x * (x - 2 / 3) * (x - 3 / 3);
    const l2 = l2c * x * (x - 2 / 3) * (x - 1 / 3);

    return l1 + l2;
  }

  private visibleDistrib(x: number, full: number) {
    const squash = 1e+2;
    return Math.exp(-squash * Math.pow(x - full, 2.0));
  }

  /** 
   * Update colors and position based on scroll position.
   * @param newScroll Scroll value, between 0.0 and 1.0
   */
  private updateScroll(newScroll: number) {
    this.scroll = newScroll;

    const l = this.lagrange(newScroll);
    this.renderer.setClearColor(new THREE.Color(l, l, l));

    const camAngle = 1.5 * newScroll * Math.PI;
    const camX = Portfolio.DISTANCE * Math.cos(camAngle);
    const camZ = Portfolio.DISTANCE * Math.sin(camAngle);
    this.camera.lookAt(camX, 0.0, camZ);

    this.group1.scale.setScalar(this.visibleDistrib(newScroll, 0 / 3));
    this.group2.scale.setScalar(this.visibleDistrib(newScroll, 1 / 3));
    this.group3.scale.setScalar(this.visibleDistrib(newScroll, 2 / 3));
    this.group4.scale.setScalar(this.visibleDistrib(newScroll, 3 / 3));

    // Update center mesh position
    // this.fractalMesh.position.setX(xPos - 1.25);

    // Update uniforms
    // this.fractalShader.uniforms['u_scroll'].value = newScroll;
    // this.backgroundShader.uniforms['u_scroll'].value = newScroll;
  };

  private updateLanguage(language: typeof Portfolio.POSSIBLE_LANGUAGES[number]) {
    for (const lang of Portfolio.POSSIBLE_LANGUAGES) {
      document.getElementById(`lang-${lang}-button`)
        ?.classList[language === lang ? 'add' : 'remove']('button-active');

      document.documentElement.style.setProperty(
        `--lang-${lang}-display`, language === lang ? 'unset' : 'none'
      );
    }
  }

  private setupScroll() {
    document.getElementById("main")?.addEventListener('scroll', event => {
      const main = event?.target as HTMLElement;
      const t = main.scrollTop / (main.scrollHeight - main.clientHeight);
      this.updateScroll(t);
    });
  }

  private setupLanguage() {
    for (const lang of Portfolio.POSSIBLE_LANGUAGES) {
      document.getElementById(`lang-${lang}-button`)!.onclick = this.updateLanguage.bind(this, lang);
    }
  }

  private setupShaders() {
    this.solidShader = new THREE.ShaderMaterial({
      vertexShader: solidVertex,
      fragmentShader: solidFragment,
      uniforms: {
        u_color: { value: new THREE.Color, },
      },
    });

    this.gridShader = new THREE.ShaderMaterial({
      vertexShader: gridVertex,
      fragmentShader: gridFragment,
    });

    // this.fractalShader = new THREE.ShaderMaterial({
    //   vertexShader: fractalVertex,
    //   fragmentShader: fractalFragment,
    //   uniforms: {
    //     u_time: { value: this.time },
    //     u_scroll: { value: this.scroll },
    //     u_center: { value: new THREE.Vector3, },
    //   },
    // });
  }

  private setupScene1stGroup() {
    // const sphereShader = this.solidShader.clone();
    // sphereShader.uniforms['u_color'].value = new THREE.Vector3(1, 1, 1);

    const room_size = 0.5;
    const quart_diagonal = 0.25 * room_size * Math.SQRT2;

    const floorGeom = new THREE.PlaneGeometry(room_size, room_size);
    const floorMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(1.0, 1.0, 1.0), });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.translateX(Portfolio.DISTANCE);
    floor.rotateX(-0.5 * Math.PI);
    floor.rotateZ(0.25 * Math.PI);
    this.group1.add(floor);

    const wall1Geom = new THREE.PlaneGeometry(0.5, 0.5);
    const wall1Mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(1.0, 0.0, 0.0) });
    const wall1 = new THREE.Mesh(wall1Geom, wall1Mat);
    wall1.translateX(Portfolio.DISTANCE + quart_diagonal);
    wall1.translateY(room_size / 2)
    wall1.translateZ(quart_diagonal);
    wall1.rotateY(1.25 * Math.PI);
    this.group1.add(wall1);

    const wall2Geom = new THREE.PlaneGeometry(0.5, 0.5);
    const wall2Mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.0, 1.0, 0.0) });
    const wall2 = new THREE.Mesh(wall2Geom, wall2Mat);
    wall2.translateX(Portfolio.DISTANCE + quart_diagonal);
    wall2.translateY(room_size / 2)
    wall2.translateZ(-quart_diagonal);
    wall2.rotateY(-0.25 * Math.PI);
    this.group1.add(wall2);

    const mat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(1.0, 1.0, 0.89),
      emissive: new THREE.Color(1.0, 1.0, 0.89),
      emissiveIntensity: 0.9,
    });

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05), mat);
    sphere.translateX(Portfolio.DISTANCE + quart_diagonal);
    sphere.translateY(quart_diagonal);
    this.group1.add(sphere);

    const light = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 1.9);
    light.translateX(Portfolio.DISTANCE + quart_diagonal);
    light.translateY(quart_diagonal);
    this.group1.add(light);

    this.group1.translateZ(-0.8);
    this.group1.translateY(-0.2);

    this.scene.add(this.group1);
  }

  private async setupScene2ndGroup() {

    this.group2.rotateY(1.5 * Math.PI);
    this.group2.translateZ(-0.8);
    this.group2.translateY(-0.2);

    this.scene.add(this.group2);
  }

  private async setupScene3rdGroup() {
    const floorGeom = new THREE.PlaneGeometry();
    const floorMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
    const floor = new THREE.GridHelper(1.0, 10);
    // const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.translateX(Portfolio.DISTANCE);
    // floor.rotateX(-0.5 * Math.PI);
    floor.rotateY(0.25 * Math.PI);
    // floor.rotateZ(0.25 * Math.PI);
    this.group3.add(floor);

    const uniSign = await this.loader.loadAsync(modelUniveristy);
    uniSign.translateX(Portfolio.DISTANCE);
    uniSign.translateY(0.15)
    uniSign.scale.setScalar(0.1);
    uniSign.rotateY(0.75 * Math.PI);
    uniSign.children.map((obj: any) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0xc91e26),
        });
      }
    });
    this.group3.add(uniSign);

    this.group3.rotateY(1.0 * Math.PI);
    this.group3.translateZ(+0.8);
    this.group3.translateY(-0.2);

    this.scene.add(this.group3);
  }

  private async setupScene4thGroup() {
    const backdrop = await this.loader.loadAsync(modelBackdrop);
    backdrop.translateX(Portfolio.DISTANCE);
    backdrop.scale.setScalar(0.0085);
    backdrop.rotateY(1.25 * Math.PI);
    this.group4.add(backdrop);

    const rook = await this.loader.loadAsync(modelRook);
    rook.translateX(Portfolio.DISTANCE + 0.15);
    rook.translateY(0.35);
    rook.translateZ(-0.25);
    rook.rotateY(0.5 * Math.PI);
    rook.scale.setScalar(0.1);
    rook.children.map((obj: any) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(1.0, 0.6, 0.7),
        });
      }
    });
    this.group4.add(rook);

    const gameboy = await this.loader.loadAsync(modelGameboy);
    gameboy.translateX(Portfolio.DISTANCE);
    gameboy.translateY(0.15);
    gameboy.translateZ(+0.00);
    gameboy.rotateY(0.75 * Math.PI);
    gameboy.scale.setScalar(0.1);
    gameboy.children.map((obj: any) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(1.0, 0.6, 0.7),
          emissiveIntensity: 1.2,
        });
      }
    });
    this.group4.add(gameboy);

    const lambda = await this.loader.loadAsync(modelLambda);
    lambda.translateX(Portfolio.DISTANCE - 0.15);
    lambda.translateY(-0.05);
    lambda.translateZ(+0.25);
    lambda.rotateY(0.75 * Math.PI);
    lambda.scale.setScalar(0.1);
    lambda.children.map((obj: any) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshPhongMaterial({
          emissive: new THREE.Color(1.0, 0.6, 0.7),
          emissiveIntensity: 1.2,
        });
      }
    });
    this.group4.add(lambda);

    this.group4.rotateY(0.5 * Math.PI);
    this.group4.translateZ(+1.0);
    this.group4.translateY(-0.2);

    this.scene.add(this.group4);
  }

  private setupScene() {
    this.setupScene1stGroup();
    this.setupScene2ndGroup();
    this.setupScene3rdGroup();
    this.setupScene4thGroup();
  }

  private setupCamera() {
    this.camera.translateY(1.0);
    this.camera.lookAt(2.0, 0.0, 0.0);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  private setupRenderer() {
    // Append the renderer output to the DOM
    document.getElementById('3d-bg')?.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(new THREE.Color(0, 0, 0));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    window.addEventListener('resize', () => {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    });
  }

  private renderFrame(timestamp: number) {
    this.updateTime(timestamp);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderFrame.bind(this));
  }

  constructor() {
    this.scene = new THREE.Scene;
    this.loader = new FBXLoader;
    this.camera = new THREE.PerspectiveCamera;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.group1 = new THREE.Group;
    this.group2 = new THREE.Group;
    this.group3 = new THREE.Group;
    this.group4 = new THREE.Group;

    this.setupScroll();
    this.setupLanguage();

    this.setupShaders();
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();

    // Begin rendering
    requestAnimationFrame(this.renderFrame.bind(this));
  }
};

new Portfolio;
