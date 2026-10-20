import { ETAPE3_QUESTIONS } from './content.js';
import { getState, bindField, bindImport, exportData, resetData, downloadFile, el } from './storage.js';

const app = document.getElementById('etape3-app');
const etape4 = document.getElementById('etape4-field');
const recap = document.getElementById('recap');

const nomTache = (t, i) => (t.titre.trim() ? t.titre.trim() : `Tâche ${i + 1}`);

getState().taches.forEach((tache, ti) => {
  const card = el('div', 'card card-white');
  card.appendChild(el('h2', '', nomTache(tache, ti)));
  ETAPE3_QUESTIONS.forEach((q) => {
    const row = el('div', 'form-row');
    const label = el('label', '', q.texte);
    const ta = el('textarea', 'note note-big');
    ta.rows = 2;
    ta.id = `e3-${ti}-${q.id}`;
    label.htmlFor = ta.id;
    bindField(
      ta,
      (s) => s.etape3[ti]?.[q.id],
      (s, v) => {
        s.etape3[ti] = s.etape3[ti] || {};
        s.etape3[ti][q.id] = v;
      }
    );
    row.append(label, ta);
    card.appendChild(row);
  });
  app.appendChild(card);
});

bindField(etape4, (s) => s.etape4, (s, v) => { s.etape4 = v; });

const minutes = (v) => Number(v) || 0;

function stats(tache) {
  const sous = tache.sous.filter((s) => s.nom.trim() || s.duree);
  const total = sous.reduce((n, s) => n + minutes(s.duree), 0);
  const avecIA = sous.filter((s) => s.ia === 'oui');
  const tempsIA = avecIA.reduce((n, s) => n + minutes(s.duree), 0);
  return { sous, total, nbIA: avecIA.length, tempsIA };
}

function renderRecap() {
  const { taches, etape3, etape4: texte4 } = getState();
  recap.innerHTML = '';

  taches.forEach((tache, ti) => {
    const block = el('div', 'recap-block');
    block.appendChild(el('h3', '', `Tâche ${ti + 1} : ${nomTache(tache, ti)}`));
    const { sous, total, nbIA, tempsIA } = stats(tache);
    if (!sous.length) {
      block.appendChild(el('p', 'muted', 'Pas encore de sous-tâche renseignée.'));
    } else {
      const ol = el('ol');
      sous.forEach((s) => {
        const li = el('li');
        li.appendChild(el('span', '', s.nom || 'Sous-tâche sans nom'));
        if (s.duree) li.appendChild(el('span', 'muted', ` - ${minutes(s.duree)} min`));
        if (s.outils) li.appendChild(el('span', 'muted', ` - outils : ${s.outils}`));
        if (s.ia === 'oui') li.appendChild(el('span', 'badge badge-oui', 'IA'));
        if (s.ia === 'oui' && s.iaComment) li.appendChild(el('em', 'pre', ' - ' + s.iaComment));
        ol.appendChild(li);
      });
      block.appendChild(ol);
      const part = total ? Math.round((tempsIA / total) * 100) : 0;
      block.appendChild(
        el('p', '', `${nbIA}/${sous.length} sous-tâches avec IA` +
          (total ? ` - temps total ${total} min, dont ${tempsIA} min avec IA (${part} %).` : '.'))
      );
    }
    ETAPE3_QUESTIONS.filter((q) => etape3[ti]?.[q.id]?.trim()).forEach((q) => {
      block.appendChild(el('strong', '', q.texte));
      block.appendChild(el('p', 'pre', etape3[ti][q.id]));
    });
    recap.appendChild(block);
  });

  const b4 = el('div', 'recap-block');
  b4.appendChild(el('h3', '', "Étape 4 : ce qui n'est pas valorisé"));
  b4.appendChild(el('p', texte4.trim() ? 'pre' : 'muted', texte4.trim() || 'Pas encore de réponse.'));
  recap.appendChild(b4);
}

renderRecap();
document.addEventListener('input', renderRecap);
document.getElementById('btn-refresh').addEventListener('click', renderRecap);

function plainTextReport() {
  const { taches, etape3, etape4: texte4 } = getState();
  const lines = ["MON TRAVAIL RÉEL AVEC L'IA"];
  taches.forEach((t, ti) => {
    lines.push('', `TÂCHE ${ti + 1} : ${nomTache(t, ti)}`);
    t.sous.filter((s) => s.nom.trim() || s.duree).forEach((s, si) => {
      const ia = s.ia === 'oui' ? 'oui' + (s.iaComment ? ` (${s.iaComment})` : '') : s.ia === 'non' ? 'non' : 'non renseigné';
      lines.push(`${si + 1}. ${s.nom || '-'} | ${s.duree ? minutes(s.duree) + ' min' : 'temps non renseigné'} | outils : ${s.outils || '-'} | IA : ${ia}${s.prompts ? ' | prompts : ' + s.prompts : ''}`);
    });
    ETAPE3_QUESTIONS.forEach((q) => lines.push('', q.texte, etape3[ti]?.[q.id] || '-'));
  });
  lines.push('', "ÉTAPE 4 - CE QUI N'EST PAS VALORISÉ", texte4 || '-');
  return lines.join('\n') + '\n';
}

document.getElementById('btn-print').addEventListener('click', () => { renderRecap(); window.print(); });
document.getElementById('btn-txt').addEventListener('click', () => downloadFile('travail-reel-ia.txt', plainTextReport()));
document.getElementById('btn-export').addEventListener('click', () => downloadFile('travail-reel-ia-sauvegarde.json', exportData(), 'application/json'));
bindImport('btn-import', 'file-import');
document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('Effacer toutes les données enregistrées dans ce navigateur pour cet outil ?')) return;
  resetData();
  location.reload();
});
