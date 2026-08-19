import{c as d,b as u,d as l,u as m}from"./storage-DTC65TDT.js";/* empty css              */const p={en_cours:"En cours",ia_utile:"IA utile",ia_insatisfaisante:"IA ne satisfait pas",non_concernee:"Non concernée par l'IA"},c=document.getElementById("form-ajout"),f=document.getElementById("btn-ajouter"),E=document.getElementById("btn-annuler"),o=document.getElementById("btn-lancer"),i=document.getElementById("input-nom"),a=document.getElementById("liste-taches");f.addEventListener("click",()=>{c.style.display="block",i.focus()});E.addEventListener("click",()=>{c.style.display="none",i.value=""});o.addEventListener("click",()=>{const t=i.value.trim();if(!t){i.focus();return}const n=d(t);window.location.href=`/arbre.html?task=${n.id}`});i.addEventListener("keydown",t=>{t.key==="Enter"&&o.click()});function r(){const t=u();if(t.length===0){a.innerHTML=`
      <div class="empty-state">
        Aucune tâche enregistrée pour l'instant.<br />
        Cliquez sur « Ajouter une tâche » pour commencer.
      </div>`;return}const n=[...t].sort((e,s)=>new Date(s.dateAjout)-new Date(e.dateAjout));a.innerHTML=`<ul class="task-list">${n.map(v).join("")}</ul>`,a.querySelectorAll('[data-action="reprendre"]').forEach(e=>{e.addEventListener("click",()=>{window.location.href=`/arbre.html?task=${e.dataset.id}`})}),a.querySelectorAll('[data-action="supprimer"]').forEach(e=>{e.addEventListener("click",()=>{confirm("Supprimer cette tâche ?")&&(l(e.dataset.id),r())})}),a.querySelectorAll('[data-action="changer-statut"]').forEach(e=>{e.addEventListener("change",()=>{m(e.dataset.id,{statut:e.value}),r()})})}function v(t){const n=Object.entries(p).map(([e,s])=>`<option value="${e}" ${t.statut===e?"selected":""}>${s}</option>`).join("");return`
    <li class="task-item">
      <div>
        <div class="task-name">${h(t.nom)}</div>
        <select class="task-status-select status-${t.statut}" data-action="changer-statut" data-id="${t.id}">
          ${n}
        </select>
      </div>
      <div class="task-actions">
        <a href="#" data-action="reprendre" data-id="${t.id}">${t.statut==="en_cours"?"Reprendre le questionnaire":"Refaire le questionnaire"}</a>
        <a href="#" data-action="supprimer" data-id="${t.id}">Supprimer</a>
      </div>
    </li>`}function h(t){const n=document.createElement("div");return n.textContent=t,n.innerHTML}r();
