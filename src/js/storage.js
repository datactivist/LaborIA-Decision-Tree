// Gestion des tâches en localStorage
// Structure d'une tâche :
// {
//   id: string,
//   nom: string,
//   dateAjout: string (ISO),
//   statut: 'en_cours' | 'ia_utile' | 'ia_insatisfaisante' | 'non_concernee',
//   parcours: [{ question: string, reponse: string }]
// }

const STORAGE_KEY = 'laboria_taches';

export function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erreur de lecture du localStorage', e);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(nom) {
  const tasks = getTasks();
  const task = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    nom,
    dateAjout: new Date().toISOString(),
    statut: 'en_cours',
    parcours: [],
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function getTask(id) {
  return getTasks().find((t) => t.id === id) || null;
}

export function updateTask(id, updates) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}

export function addStepToTask(id, question, reponse) {
  const task = getTask(id);
  if (!task) return null;
  const parcours = [...task.parcours, { question, reponse }];
  return updateTask(id, { parcours });
}
