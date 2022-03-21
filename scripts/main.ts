import * as THREE from 'three';

import {
  SiteColor,
  randomGeometry,
  randomPastelColour,
} from './util';

import gridVertex from './shaders/grid.vert.glsl';
import gridFragment from './shaders/grid.frag.glsl';

import fractalVertex from './shaders/fractal.vert.glsl';
import fractalFragment from './shaders/fractal.frag.glsl';

import backgroundVertex from './shaders/background.vert.glsl';
import backgroundFragment from './shaders/background.frag.glsl';

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
  static BACKGROUND_MESH_COUNT = 100;
  static POSSIBLE_LANGUAGES = ['en', 'ro'] as const;

  private siteColors!: readonly [SiteColor, SiteColor, SiteColor];
  private threeColors!: [THREE.Color, THREE.Color, THREE.Color];
  private colorSchemeQuery!: MediaQueryList;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private time: number = 0.0;
  private scroll: number = 0.0;

  private planeShader!: THREE.ShaderMaterial;
  private fractalShader!: THREE.ShaderMaterial;
  private backgroundShader!: THREE.ShaderMaterial;

  private lerpThreeColor(): THREE.Color {
    const color = new THREE.Color();

    if (this.scroll < 0.5) {
      color.lerpColors(
        this.threeColors[0],
        this.threeColors[1],
        2 * this.scroll,
      )
    } else {
      color.lerpColors(
        this.threeColors[1],
        this.threeColors[2],
        2 * (this.scroll - .5),
      )
    }

    return color;
  }

  private updateTime(timestamp: number) {
    this.time = timestamp;

    // Update uniforms
    this.fractalShader.uniforms['u_time'].value = timestamp;
    this.backgroundShader.uniforms['u_time'].value = timestamp;
  }

  private updateScroll(newScroll: number) {
    this.scroll = newScroll;

    // Update uniforms
    const color = this.lerpThreeColor();
    this.fractalShader.uniforms['u_color'].value = color;
    this.fractalShader.uniforms['u_scroll'].value = newScroll;
    this.backgroundShader.uniforms['u_color'].value = color;
    this.backgroundShader.uniforms['u_scroll'].value = newScroll;
  };

  private updateColors(colorScheme: 'dark' | 'light') {
    // Set dark/light mode colors in CSS
    this.siteColors.map((color, i) => {
      const colorNames = ['first-color', 'second-color', 'third-color'];
      document.documentElement.style.setProperty(`--${colorNames[i]}`, '#' + color[colorScheme].getHexString());
    });

    // Update THREE.js Colors tuple
    this.threeColors = this.siteColors.map(color => color[colorScheme]) as typeof this.threeColors;

    // Set dark/light mode colors in THREE.js scene
    if (this.fractalShader && this.fractalShader.uniforms) {
      const color = this.lerpThreeColor();
      this.fractalShader.uniforms['u_color'].value = color;
      this.backgroundShader.uniforms['u_color'].value = color;
    }
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

  private setupColors() {
    this.siteColors = [
      randomPastelColour(),
      randomPastelColour(),
      randomPastelColour()
    ] as const;

    this.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.colorSchemeQuery.onchange = event => {
      this.updateColors(event.matches ? 'dark' : 'light');
    }

    // Initial update of colors!
    this.updateColors(this.colorSchemeQuery.matches ? 'dark' : 'light');
  }

  private setupLanguage() {
    for (const lang of Portfolio.POSSIBLE_LANGUAGES) {
      document.getElementById(`lang-${lang}-button`)!.onclick = this.updateLanguage.bind(this, lang);
    }
  }

  private setupShaders() {
    this.planeShader = new THREE.ShaderMaterial({
      vertexShader: gridVertex,
      fragmentShader: gridFragment,
    });

    this.fractalShader = new THREE.ShaderMaterial({
      vertexShader: fractalVertex,
      fragmentShader: fractalFragment,
      uniforms: {
        u_time: { value: this.time },
        u_scroll: { value: this.scroll },
        u_center: { value: new THREE.Vector3, },
        u_color: { value: this.lerpThreeColor() },
      },
    });

    this.backgroundShader = new THREE.ShaderMaterial({
      wireframe: true,
      vertexShader: backgroundVertex,
      fragmentShader: backgroundFragment,
      uniforms: {
        u_time: { value: this.time },
        u_scroll: { value: this.scroll },
        u_color: { value: this.lerpThreeColor() },
      },
    });
  }

  private setupScene() {
    const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(25, 20), this.planeShader);
    planeMesh.rotateX(-Math.PI / 2);

    const fractalMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 80, 60), this.fractalShader);
    this.fractalShader.uniforms['u_center'].value = new THREE.Vector3(-1.25, 1.0, 0.0);
    fractalMesh.translateX(-1.25);
    fractalMesh.translateY(1.0);
    fractalMesh.scale.setScalar(0.65);

    this.scene.add(planeMesh, fractalMesh);

    const backgroundGroup = new THREE.Group();

    for (let i = 0; i < Portfolio.BACKGROUND_MESH_COUNT; i++) {
      const mesh = new THREE.Mesh(randomGeometry(), this.backgroundShader);

      mesh.translateY(Math.random() * 130 - 100);
      mesh.translateZ(-40 - Math.random() * 80);
      mesh.translateX(Math.sign(Math.random() - 0.5) * (Math.random() * 40 + 20));

      mesh.rotateX(Math.random() * 2 * Math.PI);
      mesh.rotateY(Math.random() * 2 * Math.PI);
      mesh.rotateZ(Math.random() * 2 * Math.PI);

      backgroundGroup.add(mesh);
    }

    this.scene.add(backgroundGroup);
  }

  private setupCamera() {
    // Move the camera back a tad
    this.camera.translateY(1.0);
    this.camera.translateZ(3.0);
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
    this.camera = new THREE.PerspectiveCamera;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.setupScroll();
    this.setupColors();
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
