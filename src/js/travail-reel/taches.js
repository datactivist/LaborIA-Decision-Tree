import { SOUS_TACHE_FIELDS } from './content.js';
import { getState, updateState, newSousTache, bindField, el } from './storage.js';

const app = document.getElementById('taches-app');

function field(label, node) {
  const row = el('div', 'form-row');
  const l = el('label', '', label);
  node.id = node.id || 'f-' + Math.random().toString(36).slice(2);
  l.htmlFor = node.id;
  row.append(l, node);
  return row;
}

function input(type, read, write) {
  const i = el('input', 'note');
  i.type = type;
  if (type === 'number') i.min = '0';
  return bindField(i, read, write);
}

function textarea(read, write) {
  const t = el('textarea', 'note');
  t.rows = 1;
  return bindField(t, read, write);
}

function renderSousTache(ti, si, total) {
  const block = el('fieldset', 'statement');
  block.appendChild(el('legend', '', `Sous-tâche ${si + 1}`));
  const sous = (s) => s.taches[ti].sous[si];

  block.appendChild(field('Que faites-vous concrètement ? (dans l\'ordre)', input('text', (s) => sous(s).nom, (s, v) => { sous(s).nom = v; })));

  const grid = el('div', 'grid-2');
  grid.appendChild(field(SOUS_TACHE_FIELDS.duree, input('number', (s) => sous(s).duree, (s, v) => { sous(s).duree = v; })));
  grid.appendChild(field(SOUS_TACHE_FIELDS.outils, input('text', (s) => sous(s).outils, (s, v) => { sous(s).outils = v; })));
  block.appendChild(grid);

  const choices = el('div', 'choices');
  [['oui', 'Oui'], ['non', 'Non']].forEach(([value, label]) => {
    const lab = el('label', 'choice');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = `ia-${ti}-${si}`;
    radio.value = value;
    radio.checked = getState().taches[ti].sous[si].ia === value;
    radio.addEventListener('change', () => updateState((s) => { sous(s).ia = value; }));
    lab.append(radio, document.createTextNode(' ' + label));
    choices.appendChild(lab);
  });
  const iaRow = el('div', 'form-row');
  iaRow.append(el('label', '', 'Utilisez-vous l\'IA pour cette sous-tâche ?'), choices);
  block.appendChild(iaRow);

  block.appendChild(field(SOUS_TACHE_FIELDS.iaComment, textarea((s) => sous(s).iaComment, (s, v) => { sous(s).iaComment = v; })));
  block.appendChild(field(SOUS_TACHE_FIELDS.prompts, textarea((s) => sous(s).prompts, (s, v) => { sous(s).prompts = v; })));

  if (total > 1) {
    const rm = el('button', 'btn btn-outline', 'Supprimer cette sous-tâche');
    rm.type = 'button';
    rm.addEventListener('click', () => {
      updateState((s) => { s.taches[ti].sous.splice(si, 1); });
      render();
    });
    block.appendChild(rm);
  }
  return block;
}

function render() {
  app.innerHTML = '';
  getState().taches.forEach((tache, ti) => {
    const card = el('div', 'card card-white');
    card.appendChild(el('h2', '', `Tâche ${ti + 1}`));

    card.appendChild(
      field('Étape 1 : intitulé de cette tâche au cœur de votre métier',
        input('text', (s) => s.taches[ti].titre, (s, v) => { s.taches[ti].titre = v; }))
    );

    card.appendChild(el('h3', '', 'Étape 2 : mes sous-tâches'));
    tache.sous.forEach((_, si) => card.appendChild(renderSousTache(ti, si, tache.sous.length)));

    const add = el('button', 'btn btn-secondary', '+ Ajouter une sous-tâche');
    add.type = 'button';
    add.addEventListener('click', () => {
      updateState((s) => { s.taches[ti].sous.push(newSousTache()); });
      render();
    });
    card.appendChild(add);
    app.appendChild(card);
  });
}

render();
