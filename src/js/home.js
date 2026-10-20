import { tools } from './tools.js';

const grid = document.getElementById('tools-grid');

grid.innerHTML = tools
  .map((tool) => {
    const available = tool.status === 'available';
    return `
      <article class="tool-card${available ? '' : ' tool-card-soon'}">
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        ${
          available
            ? `<a class="btn btn-primary" href="${tool.path}">Utiliser l'outil &rarr;</a>`
            : `<a class="btn btn-outline" href="${tool.path}">Bientôt disponible</a>`
        }
      </article>`;
  })
  .join('');
