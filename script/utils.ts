/**
 * This file contains utlity listeners not related to the interactive
 * nature of the site.
 */

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

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

// Load injected SVGs
window.addEventListener('load', _ => {
  Array.from(document.getElementsByClassName('injected-svg'))
    .forEach(el => {
      fetch(el.getAttribute('src')!).then(r => {
        r.text().then(t => el.outerHTML = t);
      });
    });
})

export const loadSingleFBXModel = (() => {
  const fbxLoader = new FBXLoader;

  return async (uri: string): Promise<THREE.Mesh> => {
    const group = await fbxLoader.loadAsync(uri);
    return group.children.find((c: any) => c.isMesh) as THREE.Mesh;
  }
})();
