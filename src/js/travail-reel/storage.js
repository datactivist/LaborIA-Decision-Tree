// Sauvegarde des résultats dans le localStorage (aucune donnée n'est envoyée)
// Structure :
// {
//   taches: [{ titre, sous: [{ nom, duree, outils, ia: 'oui'|'non'|'', iaComment, prompts }] }],
//   etape3: [{ sansIA, gainTemps, confort, importantes }],   // une entrée par tâche
//   etape4: string,
//   updatedAt: string (ISO)
// }
import { NB_TACHES } from './content.js';

const STORAGE_KEY = 'laboria_travail_reel';

export const newSousTache = () => ({ nom: '', duree: '', outils: '', ia: '', iaComment: '', prompts: '' });

function defaultState() {
  return {
    taches: Array.from({ length: NB_TACHES }, () => ({ titre: '', sous: [newSousTache()] })),
    etape3: Array.from({ length: NB_TACHES }, () => ({})),
    etape4: '',
    updatedAt: null,
  };
}

export function getState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) {
    console.error('Erreur de lecture du localStorage', e);
    return defaultState();
  }
}

export function updateState(mutate) {
  const state = getState();
  mutate(state);
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function exportData() {
  return JSON.stringify(getState(), null, 2);
}

export function importData(json) {
  const data = JSON.parse(json);
  if (typeof data !== 'object' || data === null || !Array.isArray(data.taches) || !Array.isArray(data.etape3)) {
    throw new Error('Fichier invalide');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultState(), ...data }));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadFile(filename, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Branche un bouton et un input[type=file] caché pour importer une sauvegarde JSON
export function bindImport(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!button || !input) return;
  button.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      importData(await file.text());
      location.reload();
    } catch (e) {
      alert("Ce fichier n'est pas une sauvegarde valide.");
    }
    input.value = '';
  });
}

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Champ texte/zone de texte relié à l'état : `read` lit la valeur, `write` l'enregistre
export function bindField(node, read, write) {
  node.value = read(getState()) ?? '';
  const autosize = () => {
    if (node.tagName !== 'TEXTAREA') return;
    node.style.height = 'auto';
    node.style.height = node.scrollHeight + 'px';
  };
  node.addEventListener('input', () => {
    autosize();
    updateState((s) => write(s, node.value));
  });
  queueMicrotask(autosize);
  return node;
}
