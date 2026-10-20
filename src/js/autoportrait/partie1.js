import { PROMPT_TEMPLATE } from './content.js';
import { getState, updateState, bindFields } from './storage.js';

const dureeInput = document.getElementById('input-duree');
const promptEl = document.getElementById('prompt-text');
const copyBtn = document.getElementById('btn-copy');

function currentPrompt() {
  const n = parseInt(dureeInput.value, 10);
  return PROMPT_TEMPLATE.replace('[X]', Number.isFinite(n) && n > 0 ? String(n) : '[X]');
}

function renderPrompt() {
  promptEl.textContent = currentPrompt();
}

dureeInput.value = getState().duree;
dureeInput.addEventListener('input', () => {
  const n = parseInt(dureeInput.value, 10);
  if (Number.isFinite(n) && n > 0) {
    updateState((s) => {
      s.duree = n;
    });
  }
  renderPrompt();
});
renderPrompt();

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentPrompt());
    copyBtn.textContent = 'Copié ✓';
  } catch (e) {
    const range = document.createRange();
    range.selectNodeContents(promptEl);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    copyBtn.textContent = 'Sélectionné : faites Ctrl+C';
  }
  setTimeout(() => {
    copyBtn.textContent = 'Copier le prompt';
  }, 2500);
});

bindFields();
