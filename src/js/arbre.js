import { loadTree } from './csv.js';
import { getTask, updateTask, addStepToTask } from './storage.js';

const CSV_PATH = '/data/arbre_decision.csv';
const START_NODE = 'q1';

const contenuEl = document.getElementById('contenu-arbre');
const titreEl = document.getElementById('titre-tache');
const btnRetour = document.getElementById('btn-retour');

const params = new URLSearchParams(window.location.search);
const taskId = params.get('task');

let tree = null;
let task = null;
let historique = []; // pile des ids de nœuds visités
let nodeActuel = START_NODE;

async function init() {
  if (!taskId) {
    contenuEl.innerHTML = `<p>Aucune tâche sélectionnée.</p>`;
    return;
  }

  task = getTask(taskId);
  if (!task) {
    contenuEl.innerHTML = `<p>Tâche introuvable.</p>`;
    return;
  }

  titreEl.textContent = task.nom;

  try {
    tree = await loadTree(CSV_PATH);
  } catch (err) {
    contenuEl.innerHTML = `<p>Erreur de chargement de l'arbre : ${err.message}</p>`;
    return;
  }

  // reprendre là où on s'était arrêté si un parcours existe déjà
  nodeActuel = START_NODE;
  historique = [];

  render();
}

function render() {
  const node = tree[nodeActuel];
  if (!node) {
    contenuEl.innerHTML = `<p>Erreur : nœud "${nodeActuel}" introuvable dans le CSV.</p>`;
    return;
  }

  btnRetour.style.display = historique.length > 0 ? 'inline-block' : 'none';

  if (node.type === 'resultat') {
    renderResultat(node);
  } else {
    renderQuestion(node);
  }
}

function renderQuestion(node) {
  contenuEl.innerHTML = `
    <div class="tree-question">${escapeHtml(node.texte)}</div>
    <div class="tree-buttons">
      ${node.boutons.map((b, i) => `<button class="btn btn-primary" data-index="${i}">${escapeHtml(b.label)}</button>`).join('')}
    </div>
  `;

  contenuEl.querySelectorAll('[data-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bouton = node.boutons[Number(btn.dataset.index)];
      addStepToTask(task.id, node.texte, bouton.label);
      historique.push(nodeActuel);
      nodeActuel = bouton.suivant;
      render();
    });
  });
}

function renderResultat(node) {
  if (node.categorie === 'non_concernee') {
    // Tâche non concernée par l'IA : pas de classification à faire
    updateTask(task.id, { statut: 'non_concernee' });
    contenuEl.innerHTML = `
      <div class="tree-result-box">
        <p>${escapeHtml(node.texte)}</p>
        <div class="btn-row" style="justify-content:center;">
          <a class="btn btn-primary" href="/taches.html">Retour à mes tâches</a>
        </div>
      </div>
    `;
    return;
  }

  // Sinon : l'utilisateur choisit lui-même dans quelle colonne classer sa tâche
  // (la catégorie suggérée par l'arbre est pré-indiquée mais reste modifiable)
  const suggestionUtile = node.categorie === 'ia_utile';
  const suggestionInsatisfaisante = node.categorie === 'ia_insatisfaisante';

  contenuEl.innerHTML = `
    <div class="tree-result-box">
      <p>${escapeHtml(node.texte)}</p>
      <p>Dans quel tableau souhaitez-vous placer cette tâche ?</p>
      <div class="btn-row" style="justify-content:center;">
        <button class="btn ${suggestionUtile ? 'btn-primary' : 'btn-outline'}" data-statut="ia_utile">
          IA utile, sans gros travail de reprise
        </button>
        <button class="btn ${suggestionInsatisfaisante ? 'btn-primary' : 'btn-outline'}" data-statut="ia_insatisfaisante">
          IA ne donne pas satisfaction
        </button>
      </div>
    </div>
  `;

  contenuEl.querySelectorAll('[data-statut]').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateTask(task.id, { statut: btn.dataset.statut });
      window.location.href = '/taches.html';
    });
  });
}

btnRetour.addEventListener('click', () => {
  if (historique.length === 0) return;
  nodeActuel = historique.pop();
  render();
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

init();
