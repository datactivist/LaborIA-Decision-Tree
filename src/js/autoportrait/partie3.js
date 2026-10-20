import { PARTIE2_THEMES, PARTIE3_QUESTIONS, CHOICES } from './content.js';
import { getState, bindFields, exportData, bindImport, resetData, downloadFile } from './storage.js';

const app = document.getElementById('partie3-app');
const recap = document.getElementById('recap');

PARTIE3_QUESTIONS.forEach((q, i) => {
  const card = document.createElement('div');
  card.className = 'card card-white';
  const h3 = document.createElement('h3');
  h3.textContent = `${i + 1}. ${q.texte}`;
  const ta = document.createElement('textarea');
  ta.className = 'note note-big';
  ta.rows = 3;
  ta.dataset.field = `p3.${q.id}`;
  ta.setAttribute('aria-label', q.texte);
  card.append(h3, ta);
  app.appendChild(card);
});

const choiceLabel = Object.fromEntries(CHOICES.map((c) => [c.value, c.label]));

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderRecap() {
  const { p1, p2 } = getState();
  recap.innerHTML = '';

  const part1 = el('div', 'recap-block');
  part1.appendChild(el('h3', '', 'Partie 1 - Mon utilisation de l\'IA'));
  const rows = [
    ['Ce qui conforte ce que je savais déjà', p1.conforte],
    ['Ce qui me surprend', p1.surprend],
    ['Ce avec quoi je suis en désaccord', p1.desaccord],
  ].filter(([, v]) => v && v.trim());
  if (!rows.length) part1.appendChild(el('p', 'muted', 'Pas encore de réponse.'));
  rows.forEach(([k, v]) => {
    part1.appendChild(el('strong', '', k));
    part1.appendChild(el('p', 'pre', v));
  });
  recap.appendChild(part1);

  const part2 = el('div', 'recap-block');
  part2.appendChild(el('h3', '', "Partie 2 - Ce que l'IA fait à mon travail"));
  const counts = { oui: 0, moitie: 0, non: 0 };
  PARTIE2_THEMES.forEach((theme) => {
    const answered = theme.items.filter((i) => p2[i.id]?.choix);
    if (!answered.length) return;
    part2.appendChild(el('strong', '', theme.titre));
    const ul = el('ul');
    answered.forEach((i) => {
      counts[p2[i.id].choix] += 1;
      const li = el('li');
      li.appendChild(el('span', '', i.texte + ' '));
      li.appendChild(el('span', 'badge badge-' + p2[i.id].choix, choiceLabel[p2[i.id].choix]));
      if (p2[i.id].note?.trim()) li.appendChild(el('em', 'pre', ' - ' + p2[i.id].note));
      ul.appendChild(li);
    });
    part2.appendChild(ul);
  });
  const sum = counts.oui + counts.moitie + counts.non;
  part2.appendChild(
    el('p', sum ? '' : 'muted', sum
      ? `En tout : ${counts.oui} « me parle », ${counts.moitie} « à moitié », ${counts.non} « pas du tout ».`
      : 'Pas encore de réponse.')
  );
  recap.appendChild(part2);
}

bindFields();
renderRecap();

function plainTextReport() {
  const { duree, p1, p2, p3 } = getState();
  const lines = ["AUTOPORTRAIT : L'IA DANS MON QUOTIDIEN", '', 'PARTIE 1 - MON UTILISATION DE L\'IA', `Historique analysé : ${duree} mois`];
  lines.push('', 'Ce qui conforte ce que je savais déjà :', p1.conforte || '-');
  lines.push('', 'Ce qui me surprend :', p1.surprend || '-');
  lines.push('', 'Ce avec quoi je suis en désaccord :', p1.desaccord || '-');
  lines.push('', "PARTIE 2 - CE QUE L'IA FAIT À MON TRAVAIL");
  PARTIE2_THEMES.forEach((t) => {
    lines.push('', t.titre);
    t.items.forEach((i) => {
      const a = p2[i.id];
      lines.push(`- ${i.texte} [${a?.choix ? choiceLabel[a.choix] : 'non renseigné'}]${a?.note ? ' : ' + a.note : ''}`);
    });
  });
  lines.push('', 'PARTIE 3 - BILAN');
  PARTIE3_QUESTIONS.forEach((q) => lines.push('', q.texte, p3[q.id] || '-'));
  return lines.join('\n') + '\n';
}

document.getElementById('btn-print').addEventListener('click', () => window.print());
document.getElementById('btn-txt').addEventListener('click', () => downloadFile('autoportrait-ia.txt', plainTextReport()));
document.getElementById('btn-export').addEventListener('click', () => downloadFile('autoportrait-ia-sauvegarde.json', exportData(), 'application/json'));

bindImport('btn-import', 'file-import');

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('Effacer toutes les données enregistrées dans ce navigateur pour cet outil ?')) return;
  resetData();
  location.reload();
});
