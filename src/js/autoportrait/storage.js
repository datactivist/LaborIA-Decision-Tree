// Sauvegarde des résultats dans le localStorage (aucune donnée n'est envoyée)
// Structure :
// {
//   duree: number,                       // mois d'historique pour le prompt
//   p1: { reponseIA, conforte, surprend, desaccord },
//   p2: { [id]: { choix: 'oui'|'moitie'|'non', note: string } },
//   p3: { b1, b2, b3 },
//   updatedAt: string (ISO)
// }

const STORAGE_KEY = 'laboria_autoportrait';

function defaultState() {
  return { duree: 6, p1: {}, p2: {}, p3: {}, updatedAt: null };
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
  if (typeof data !== 'object' || data === null || typeof data.p1 !== 'object' || typeof data.p2 !== 'object') {
    throw new Error('Fichier invalide');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultState(), ...data }));
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

// Lie les champs [data-field="p1.conforte"] à l'état sauvegardé, avec enregistrement automatique
export function bindFields(root = document) {
  root.querySelectorAll('[data-field]').forEach((el) => {
    const [section, key] = el.dataset.field.split('.');
    el.value = getState()[section]?.[key] || '';
    const autosize = () => {
      if (el.tagName !== 'TEXTAREA') return;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    };
    el.addEventListener('input', () => {
      autosize();
      updateState((s) => {
        s[section] = s[section] || {};
        s[section][key] = el.value;
      });
    });
    autosize();
  });
}
