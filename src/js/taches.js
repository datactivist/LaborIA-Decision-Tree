import { getTasks, createTask, deleteTask, updateTask } from './storage.js';

const STATUT_LABELS = {
  en_cours: 'En cours',
  ia_utile: "IA utile",
  ia_insatisfaisante: "IA ne satisfait pas",
  non_concernee: 'Non concernée par l\'IA',
};

const formAjout = document.getElementById('form-ajout');
const btnAjouter = document.getElementById('btn-ajouter');
const btnAnnuler = document.getElementById('btn-annuler');
const btnLancer = document.getElementById('btn-lancer');
const inputNom = document.getElementById('input-nom');
const listeTachesEl = document.getElementById('liste-taches');

btnAjouter.addEventListener('click', () => {
  formAjout.style.display = 'block';
  inputNom.focus();
});

btnAnnuler.addEventListener('click', () => {
  formAjout.style.display = 'none';
  inputNom.value = '';
});

btnLancer.addEventListener('click', () => {
  const nom = inputNom.value.trim();
  if (!nom) {
    inputNom.focus();
    return;
  }
  const task = createTask(nom);
  window.location.href = `/arbre.html?task=${task.id}`;
});

inputNom.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnLancer.click();
});

function render() {
  const tasks = getTasks();

  if (tasks.length === 0) {
    listeTachesEl.innerHTML = `
      <div class="empty-state">
        Aucune tâche enregistrée pour l'instant.<br />
        Cliquez sur « Ajouter une tâche » pour commencer.
      </div>`;
    return;
  }

  // tri : les plus récentes en premier
  const sorted = [...tasks].sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout));

  listeTachesEl.innerHTML = `<ul class="task-list">${sorted.map(taskRow).join('')}</ul>`;

  listeTachesEl.querySelectorAll('[data-action="reprendre"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = `/arbre.html?task=${btn.dataset.id}`;
    });
  });

  listeTachesEl.querySelectorAll('[data-action="supprimer"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Supprimer cette tâche ?')) {
        deleteTask(btn.dataset.id);
        render();
      }
    });
  });

  listeTachesEl.querySelectorAll('[data-action="changer-statut"]').forEach((select) => {
    select.addEventListener('change', () => {
      updateTask(select.dataset.id, { statut: select.value });
      render();
    });
  });
}

function taskRow(task) {
  const optionsStatut = Object.entries(STATUT_LABELS)
    .map(
      ([valeur, label]) =>
        `<option value="${valeur}" ${task.statut === valeur ? 'selected' : ''}>${label}</option>`
    )
    .join('');

  return `
    <li class="task-item">
      <div>
        <div class="task-name">${escapeHtml(task.nom)}</div>
        <select class="task-status-select status-${task.statut}" data-action="changer-statut" data-id="${task.id}">
          ${optionsStatut}
        </select>
      </div>
      <div class="task-actions">
        <a href="#" data-action="reprendre" data-id="${task.id}">${task.statut === 'en_cours' ? 'Reprendre le questionnaire' : 'Refaire le questionnaire'}</a>
        <a href="#" data-action="supprimer" data-id="${task.id}">Supprimer</a>
      </div>
    </li>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

render();
