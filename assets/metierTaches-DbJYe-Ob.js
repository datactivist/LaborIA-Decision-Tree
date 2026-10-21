import"./modulepreload-polyfill-P2Xu9kJm.js";/* empty css              */import{a as e,n as t,o as n,r}from"./storage-VX1XRSgB.js";var i={en_cours:`En cours`,ia_utile:`IA utile`,ia_insatisfaisante:`IA ne satisfait pas`,non_concernee:`Non concernée par l'IA`},a=document.getElementById(`form-ajout`),o=document.getElementById(`btn-ajouter`),s=document.getElementById(`btn-annuler`),c=document.getElementById(`btn-lancer`),l=document.getElementById(`input-nom`),u=document.getElementById(`liste-taches`);o.addEventListener(`click`,()=>{a.style.display=`block`,l.focus()}),s.addEventListener(`click`,()=>{a.style.display=`none`,l.value=``}),c.addEventListener(`click`,()=>{let e=l.value.trim();if(!e){l.focus();return}let n=t(e);window.location.href=`arbre.html?task=${n.id}`}),l.addEventListener(`keydown`,e=>{e.key===`Enter`&&c.click()});function d(){let t=e();t.length===0?u.innerHTML=`
      <div class="empty-state">
        Aucune tâche enregistrée pour l'instant.<br />
        Cliquez sur « Ajouter une tâche » pour commencer.
      </div>`:(u.innerHTML=`<ul class="task-list">${[...t].sort((e,t)=>new Date(t.dateAjout)-new Date(e.dateAjout)).map(f).join(``)}</ul>`,u.querySelectorAll(`[data-action="reprendre"]`).forEach(e=>{e.addEventListener(`click`,()=>{window.location.href=`arbre.html?task=${e.dataset.id}`})}),u.querySelectorAll(`[data-action="supprimer"]`).forEach(e=>{e.addEventListener(`click`,()=>{confirm(`Supprimer cette tâche ?`)&&(r(e.dataset.id),d())})}),u.querySelectorAll(`[data-action="changer-statut"]`).forEach(e=>{e.addEventListener(`change`,()=>{n(e.dataset.id,{statut:e.value}),d()})}))}function f(e){let t=Object.entries(i).map(([t,n])=>`<option value="${t}" ${e.statut===t?`selected`:``}>${n}</option>`).join(``);return`
    <li class="task-item">
      <div>
        <div class="task-name">${p(e.nom)}</div>
        <select class="task-status-select status-${e.statut}" data-action="changer-statut" data-id="${e.id}">
          ${t}
        </select>
      </div>
      <div class="task-actions">
        <a href="#" data-action="reprendre" data-id="${e.id}">${e.statut===`en_cours`?`Reprendre le questionnaire`:`Refaire le questionnaire`}</a>
        <a href="#" data-action="supprimer" data-id="${e.id}">Supprimer</a>
      </div>
    </li>`}function p(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}d();