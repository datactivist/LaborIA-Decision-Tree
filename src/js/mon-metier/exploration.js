import { getTasks, updateTask } from './storage.js';

const listeUtileEl = document.getElementById('liste-utile');
const listeInsatisfaisanteEl = document.getElementById('liste-insatisfaisante');

// association entre l'élément <ul> et le statut qu'il représente
const COLONNES = [
  { el: listeUtileEl, statut: 'ia_utile' },
  { el: listeInsatisfaisanteEl, statut: 'ia_insatisfaisante' },
];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderListe(el, tasks) {
  if (tasks.length === 0) {
    el.innerHTML = `<li class="empty-state">Aucune tâche classée ici pour le moment.<br />Glissez une tâche ici, ou changez sa catégorie depuis « Mes tâches ».</li>`;
    return;
  }
  el.innerHTML = tasks
    .map(
      (t) => `
      <li class="task-item task-item-draggable" draggable="true" data-id="${t.id}">
        <span class="task-name">${escapeHtml(t.nom)}</span>
        <span class="drag-handle" title="Glisser pour déplacer">⠿</span>
      </li>`
    )
    .join('');
}

function renderAll() {
  const tasks = getTasks();
  renderListe(listeUtileEl, tasks.filter((t) => t.statut === 'ia_utile'));
  renderListe(listeInsatisfaisanteEl, tasks.filter((t) => t.statut === 'ia_insatisfaisante'));
  attachDragEvents();
}

function attachDragEvents() {
  // les cartes elles-mêmes : on note l'id de la tâche déplacée
  document.querySelectorAll('.task-item-draggable').forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  });

  // les colonnes : zones de dépôt
  COLONNES.forEach(({ el, statut }) => {
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drop-zone-active');
    });
    el.addEventListener('dragleave', () => {
      el.classList.remove('drop-zone-active');
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drop-zone-active');
      const taskId = e.dataTransfer.getData('text/plain');
      if (!taskId) return;
      updateTask(taskId, { statut });
      renderAll();
    });
  });
}

renderAll();
