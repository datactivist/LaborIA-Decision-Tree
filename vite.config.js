import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // base relatif : fonctionne que le site soit servi à la racine
  // (username.github.io) ou dans un sous-dossier de projet
  // (username.github.io/mon-repo/)
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        taches: resolve(__dirname, 'taches.html'),
        arbre: resolve(__dirname, 'arbre.html'),
        exploration: resolve(__dirname, 'exploration.html'),
      },
    },
  },
});
