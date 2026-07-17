// Main JS: keyboard nav, smooth scroll, load projects from JSON and render cards/modals
// Comments explain how to add new projects via data/projects.json

document.addEventListener('DOMContentLoaded',function(){
  // Insert current year in footers
  const y=new Date().getFullYear();
  document.getElementById('year') && (document.getElementById('year').textContent=y);
  ['year-2','year-3','year-4','year-5'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=y});

  // Mobile nav toggle
  const navToggle=document.getElementById('nav-toggle');
  if(navToggle){
    navToggle.addEventListener('click',()=>{
      const nav=document.getElementById('site-nav');
      const expanded=navToggle.getAttribute('aria-expanded')==='true';
      navToggle.setAttribute('aria-expanded',(!expanded).toString());
      if(nav) nav.style.display = expanded ? '' : 'block';
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const target=document.querySelector(this.getAttribute('href'));
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});
      target.focus({preventScroll:true});}
    });
  });

  // Load project data and render featured, machining, and engineering cards
  fetch('/data/projects.json').then(r=>{
    if(!r.ok) throw new Error("Couldn't load projects.json");
    return r.json();
  }).then(data=>{
    renderFeatured(data);
    renderGrid('machining',data.projects.filter(p=>p.category==='machining'));
    renderGrid('engineering',data.projects.filter(p=>p.category==='engineering'));
  }).catch(err=>{
    console.warn('Project data not loaded:',err);
  });

  // Modal handling
  const modal=document.getElementById('project-modal');
  if(modal){
    modal.querySelector('.modal-close')?.addEventListener('click',closeModal);
    modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  }

  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.style.display='none';
    modal.querySelector('#modal-body').innerHTML='';
  }

  function openModal(project){
    if(!modal) return;
    const body=modal.querySelector('#modal-body');
    body.innerHTML = `\n      <h2>${escapeHtml(project.title)}</h2>\n      <p class="small">Category: ${escapeHtml(project.category)}</p>\n      <img src="${project.images?.[0]||'/assets/images/project-placeholder.svg'}" alt="${escapeHtml(project.title)} image" style="width:100%;height:auto;border-radius:6px;margin-bottom:0.5rem">\n      <h3>Summary</h3>\n      <p>${escapeHtml(project.summary||'Placeholder project summary.')}</p>\n      <h3>Details</h3>\n      <dl>\n        <dt>Material</dt><dd>${escapeHtml(project.material||'—')}</dd>\n        <dt>Processes</dt><dd>${escapeHtml(project.processes||'—')}</dd>\n        <dt>Equipment</dt><dd>${escapeHtml(project.equipment||'—')}</dd>\n        <dt>Tolerances</dt><dd>${escapeHtml(project.tolerances||'—')}</dd>\n        <dt>Role</dt><dd>${escapeHtml(project.role||'—')}</dd>\n      </dl>\n      <h3>Notes</h3>\n      <p>${escapeHtml(project.notes||'—')}</p>\n    `;
    modal.style.display='flex';
    modal.setAttribute('aria-hidden','false');
    modal.querySelector('.modal-close')?.focus();
  }

  function renderFeatured(data){
    const container=document.getElementById('featured-cards');
    if(!container) return;
    const featured = data.projects.slice(0,3);
    featured.forEach(p=>{
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML = `\n        <img src="${p.images?.[0]||'/assets/images/project-placeholder.svg'}" alt="${escapeHtml(p.title)}"/>\n        <h3>${escapeHtml(p.title)}</h3>\n        <p class="small">${escapeHtml(p.summary || '')}</p>\n        <p><button class="btn" data-id="${p.id}">View</button></p>\n      `;
      container.appendChild(card);
      card.querySelector('button')?.addEventListener('click',()=>openModal(p));
    });
  }

  function renderGrid(type,projects){
    const id = (type==='machining') ? 'machining-grid' : 'engineering-grid';
    const container=document.getElementById(id);
    if(!container) return;
    projects.forEach(p=>{
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML = `\n        <img src="${p.images?.[0]||'/assets/images/project-placeholder.svg'}" alt="${escapeHtml(p.title)} image"/>\n        <h3>${escapeHtml(p.title)}</h3>\n        <p class="small">${escapeHtml(p.material||'')}</p>\n        <p><button class="btn" data-id="${p.id}">View details</button></p>\n      `;
      container.appendChild(card);
      card.querySelector('button')?.addEventListener('click',()=>openModal(p));
    });
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
});
