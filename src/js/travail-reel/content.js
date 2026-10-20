export const NB_TACHES = 3;

export const SOUS_TACHE_FIELDS = {
  duree: 'Temps moyen (en minutes)',
  outils: 'Outils utilisés (logiciels, etc.)',
  iaComment: 'Si oui, comment utilisez-vous l\'IA ?',
  prompts: 'Réutilisez-vous régulièrement les mêmes prompts ? Si oui, lesquels ?',
};

export const ETAPE3_QUESTIONS = [
  { id: 'sansIA', texte: 'Sauriez-vous dire combien de temps cette tâche prend/prenait sans IA ?' },
  { id: 'gainTemps', texte: 'Avez-vous le sentiment de gagner du temps en utilisant l\'IA ?' },
  { id: 'confort', texte: 'Avez-vous le sentiment de gagner en confort de travail ?' },
  { id: 'importantes', texte: 'Quelles tâches/sous-tâches sont les plus importantes, que vous ne voulez pas abandonner ?' },
];
