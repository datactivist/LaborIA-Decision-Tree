// Registre des outils du bac à sable. Pour ajouter un outil : créer son dossier
// dans /tools/<id>/ avec un index.html, l'ajouter ici et dans vite.config.js.
export const tools = [
  {
    id: "autoportrait-ia",
    name: "Autoportrait : l'IA dans mon quotidien",
    description:
      "Un autodiagnostic individuel d'environ 30 à 45 minutes pour faire le bilan de votre usage de l'IA générative au travail.",
    path: "tools/autoportrait-ia/index.html",
    status: "available",
  },
  {
    id: "travail-reel-ia",
    name: "Le travail réel de l'IA",
    description:
      "Un jeu de rôle d'environ 30 à 45 minutes pour décomposer vos tâches, mesurer leur durée et évaluer la place réelle de l'IA dans votre travail.",
    path: "tools/travail-reel-ia/index.html",
    status: "available",
  },
  {
    id: "mon-metier-se-transforme",
    name: "Mon métier se transforme",
    description:
      "Estimez la part de vos tâches quotidiennes qui a évolué avec l'IA générative et découvrez des pistes d'adaptation.",
    path: "tools/mon-metier-se-transforme/index.html",
    status: "available",
  },
];
