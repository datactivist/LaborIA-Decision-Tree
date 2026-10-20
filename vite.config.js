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
        metier: resolve(__dirname, 'tools/mon-metier-se-transforme/index.html'),
        metierTaches: resolve(__dirname, 'tools/mon-metier-se-transforme/taches.html'),
        metierArbre: resolve(__dirname, 'tools/mon-metier-se-transforme/arbre.html'),
        metierExploration: resolve(__dirname, 'tools/mon-metier-se-transforme/exploration.html'),
        travailReel: resolve(__dirname, 'tools/travail-reel-ia/index.html'),
        travailReelEtapes12: resolve(__dirname, 'tools/travail-reel-ia/etapes-1-2.html'),
        travailReelEtapes34: resolve(__dirname, 'tools/travail-reel-ia/etapes-3-4.html'),
        travailReelRessources: resolve(__dirname, 'tools/travail-reel-ia/ressources.html'),
        autoportrait: resolve(__dirname, 'tools/autoportrait-ia/index.html'),
        autoportraitPartie1: resolve(__dirname, 'tools/autoportrait-ia/partie-1.html'),
        autoportraitPartie2: resolve(__dirname, 'tools/autoportrait-ia/partie-2.html'),
        autoportraitPartie3: resolve(__dirname, 'tools/autoportrait-ia/partie-3.html'),
        autoportraitRessources: resolve(__dirname, 'tools/autoportrait-ia/ressources.html'),
      },
    },
  },
});
