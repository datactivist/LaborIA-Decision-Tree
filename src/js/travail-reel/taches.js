import { TACHE_FIELDS } from "./content.js";
import {
  getState,
  updateState,
  bindField,
  el,
} from "./storage.js";

const app = document.getElementById("taches-app");

function field(label, node) {
  const row = el("div", "form-row");
  const l = el("label", "", label);
  node.id = node.id || "f-" + Math.random().toString(36).slice(2);
  l.htmlFor = node.id;
  row.append(l, node);
  return row;
}

function input(type, read, write) {
  const i = el("input", "note");
  i.type = type;
  if (type === "number") i.min = "0";
  return bindField(i, read, write);
}

function textarea(read, write) {
  const t = el("textarea", "note");
  t.rows = 1;
  return bindField(t, read, write);
}

function renderDetails(ti) {
  const block = el("div", "statement");
  const t = (s) => s.taches[ti];

  const grid = el("div", "grid-2");
  grid.appendChild(
    field(
      TACHE_FIELDS.duree,
      input(
        "number",
        (s) => t(s).duree,
        (s, v) => {
          t(s).duree = v;
        },
      ),
    ),
  );
  grid.appendChild(
    field(
      TACHE_FIELDS.outils,
      input(
        "text",
        (s) => t(s).outils,
        (s, v) => {
          t(s).outils = v;
        },
      ),
    ),
  );
  block.appendChild(grid);

  const choices = el("div", "choices");
  [
    ["oui", "Oui"],
    ["non", "Non"],
  ].forEach(([value, label]) => {
    const lab = el("label", "choice");
    const radio = el("input");
    radio.type = "radio";
    radio.name = `ia-${ti}`;
    radio.value = value;
    radio.checked = getState().taches[ti].ia === value;
    radio.addEventListener("change", () =>
      updateState((s) => {
        t(s).ia = value;
      }),
    );
    lab.append(radio, document.createTextNode(" " + label));
    choices.appendChild(lab);
  });
  const iaRow = el("div", "form-row");
  iaRow.append(
    el("label", "", "Utilisez-vous l'IA pour cette tâche ?"),
    choices,
  );
  block.appendChild(iaRow);

  block.appendChild(
    field(
      TACHE_FIELDS.iaComment,
      textarea(
        (s) => t(s).iaComment,
        (s, v) => {
          t(s).iaComment = v;
        },
      ),
    ),
  );
  block.appendChild(
    field(
      TACHE_FIELDS.prompts,
      textarea(
        (s) => t(s).prompts,
        (s, v) => {
          t(s).prompts = v;
        },
      ),
    ),
  );
  return block;
}

function render() {
  app.innerHTML = "";
  getState().taches.forEach((_, ti) => {
    const card = el("div", "card card-white");
    card.appendChild(el("h2", "", `Tâche ${ti + 1}`));

    card.appendChild(
      field(
        "Intitulé de cette tâche au cœur de votre métier",
        input(
          "text",
          (s) => s.taches[ti].titre,
          (s, v) => {
            s.taches[ti].titre = v;
          },
        ),
      ),
    );

    card.appendChild(renderDetails(ti));
    app.appendChild(card);
  });
}

render();
