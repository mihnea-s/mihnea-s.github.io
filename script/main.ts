import * as THREE from 'three';

import { Section1 } from './section1';
import { Section2 } from './section2';
import { Section3 } from './section3';
import { Section4 } from './section4';

import './utils';

interface Section {
  setup(group: THREE.Group): Promise<void>;
  update(time: number, deltaTime: number): void;
}

class Portfolio {
  static DISTANCE = 2.0 as const;
  static LANGUAGES = ['en', 'ro'] as const;
  static SECTIONS = [Section1, Section2, Section3, Section4] as const;

  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  private sections: [Section, THREE.Group][];

  private time: number = 0.0;
  private scroll: number = 0.0;

  private setupLanguage() {
    for (const lang of Portfolio.LANGUAGES) {
      document.getElementById(`lang-${lang}-button`)!.onclick = this.updateLanguage.bind(this, lang);
    }
  }

  private updateLanguage(language: typeof Portfolio.LANGUAGES[number]) {
    for (const lang of Portfolio.LANGUAGES) {
      const btn = document.getElementById(`lang-${lang}-button`);

      if (language === lang) {
        btn?.setAttribute('active', 'active')
      } else {
        btn?.removeAttribute('active');
      }

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

  private visibleDistrib(x: number, full: number) {
    const squash = 1e+4;
    return Math.exp(-squash * Math.pow(x - full, 4.0));
  }

  private updateScroll(newScroll: number) {
    this.scroll = newScroll;

    const ccSin = Math.sin((3 / 2) * Math.PI * newScroll);
    const ccValue = Math.pow(ccSin, Math.round(this.sections.length * 0.5) * 2);
    this.renderer.setClearColor(new THREE.Color(ccValue, ccValue, ccValue));

    const camAngle = 1.5 * newScroll * Math.PI;
    const camX = Portfolio.DISTANCE * Math.cos(camAngle);
    const camZ = Portfolio.DISTANCE * Math.sin(camAngle);
    this.camera.lookAt(camX, 0.0, camZ);

    for (let i = 0; i < this.sections.length; i++) {
      const N = this.sections.length - 1;
      const [_, group] = this.sections[i];
      const visibleCoef = this.visibleDistrib(newScroll, i / N);

      group.visible = visibleCoef > 0.1;
      group.scale.setScalar(visibleCoef);
    }
  };

  private updateTime(timestamp: number) {
    const delta = this.time - timestamp;
    this.time = timestamp;
    this.sections.forEach(([section, _]) => section.update(this.time, delta));
  }

  private setupScene() {
    const g1 = new THREE.Group;
    const s1 = new Section1;
    s1.setup(g1);
    g1.translateX(Portfolio.DISTANCE);
    g1.translateZ(-0.8);
    g1.translateY(-0.2);
    this.scene.add(g1);

    this.sections.push([s1, g1]);

    const g2 = new THREE.Group;
    const s2 = new Section2;
    s2.setup(g2);
    g2.rotateY(1.5 * Math.PI);
    g2.translateX(Portfolio.DISTANCE);
    g2.translateZ(-0.8);
    g2.translateY(-0.2);
    this.scene.add(g2);

    this.sections.push([s2, g2]);

    const g3 = new THREE.Group;
    const s3 = new Section3;
    s3.setup(g3);
    g3.rotateY(1.0 * Math.PI);
    g3.translateX(Portfolio.DISTANCE);
    g3.translateZ(+0.8);
    g3.translateY(-0.2);
    this.scene.add(g3);

    this.sections.push([s3, g3]);

    const g4 = new THREE.Group;
    const s4 = new Section4;
    s4.setup(g4);
    g4.rotateY(0.5 * Math.PI);
    g4.translateX(Portfolio.DISTANCE);
    g4.translateZ(+1.0);
    g4.translateY(-0.2);
    this.scene.add(g4);

    this.sections.push([s4, g4]);
  }

  private setupCamera() {
    this.camera.translateY(1.0);
    this.camera.lookAt(Portfolio.DISTANCE, 0.0, 0.0);
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
    this.camera = new THREE.PerspectiveCamera;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.sections = [];
    this.scene = new THREE.Scene;

    this.setupScene();
    this.setupCamera();
    this.setupRenderer();

    this.setupScroll();
    this.setupLanguage();

    this.updateScroll(this.scroll);

    // Begin rendering
    requestAnimationFrame(this.renderFrame.bind(this));
  }
};

new Portfolio;
