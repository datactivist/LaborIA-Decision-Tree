import { PARTIE2_THEMES, CHOICES } from './content.js';
import { getState, updateState } from './storage.js';

const app = document.getElementById('partie2-app');
const progress = document.getElementById('progress');
const total = PARTIE2_THEMES.reduce((n, t) => n + t.items.length, 0);

function renderProgress() {
  const p2 = getState().p2;
  const done = PARTIE2_THEMES.flatMap((t) => t.items).filter((i) => p2[i.id]?.choix).length;
  progress.textContent = `${done}/${total} affirmations renseignées`;
}

PARTIE2_THEMES.forEach((theme) => {
  const card = document.createElement('div');
  card.className = 'card card-white';
  const h2 = document.createElement('h2');
  h2.textContent = theme.titre;
  card.appendChild(h2);

  theme.items.forEach((item) => {
    const saved = getState().p2[item.id] || {};
    const block = document.createElement('fieldset');
    block.className = 'statement';

    const legend = document.createElement('legend');
    legend.textContent = item.texte;
    block.appendChild(legend);

    const choices = document.createElement('div');
    choices.className = 'choices';
    CHOICES.forEach((c) => {
      const label = document.createElement('label');
      label.className = 'choice choice-' + c.value;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = item.id;
      radio.value = c.value;
      radio.checked = saved.choix === c.value;
      radio.addEventListener('change', () => {
        updateState((s) => {
          s.p2[item.id] = { ...(s.p2[item.id] || {}), choix: c.value };
        });
        renderProgress();
      });
      label.append(radio, document.createTextNode(' ' + c.label));
      choices.appendChild(label);
    });
    block.appendChild(choices);

    const note = document.createElement('textarea');
    note.className = 'note';
    note.rows = 1;
    note.placeholder = 'Un mot ou une idée (facultatif)…';
    note.setAttribute('aria-label', 'Note : ' + item.texte);
    note.value = saved.note || '';
    const autosize = () => {
      note.style.height = 'auto';
      note.style.height = note.scrollHeight + 'px';
    };
    note.addEventListener('input', () => {
      autosize();
      updateState((s) => {
        s.p2[item.id] = { ...(s.p2[item.id] || {}), note: note.value };
      });
    });
    block.appendChild(note);
    queueMicrotask(autosize);

    card.appendChild(block);
  });

  app.appendChild(card);
});

renderProgress();
