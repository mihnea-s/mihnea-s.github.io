import { defineConfig } from 'vite';

import glsl from 'vite-plugin-glsl';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  assetsInclude: [
    '**/*.fbx',
  ],

  plugins: [
    glsl(),
    legacy(),
  ],
});
