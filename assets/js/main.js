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
      const media = p.video
  ? `<iframe src="${p.video}" title="${escapeHtml(p.title)} demonstration" allowfullscreen></iframe>`
  : `<img src="${p.images?.[0]||'/assets/images/project-placeholder.svg'}" alt="${escapeHtml(p.title)}"/>`;
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML = `\n        <div class="featured-media">${media}</div>\n        <h3>${escapeHtml(p.title)}</h3>\n        <p class="small">${escapeHtml(p.summary || '')}</p>\n        <p><a class="btn" href="${p.detailsPage || '#'}">View Details</a></p>\n      `;
      container.appendChild(card);
    });
  }

function renderGrid(type, projects) {
  const id = type === 'machining'
    ? 'machining-grid'
    : 'engineering-grid';

  const container = document.getElementById(id);

  if (!container) return;

  /*
    The machining page gets a custom chronological project layout.
    The engineering page continues using the regular project cards.
  */
  if (type === 'machining') {
    renderMachiningProjects(container, projects);
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <img
        src="${project.images?.[0] || '/assets/images/project-placeholder.svg'}"
        alt="${escapeHtml(project.title)} image">

      <h3>${escapeHtml(project.title)}</h3>

      <p class="small">
        ${escapeHtml(project.material || '')}
      </p>

      <p>
        <button class="btn" data-id="${project.id}">
          View details
        </button>
      </p>
    `;

    container.appendChild(card);

    card.querySelector('button')?.addEventListener('click', () => {
      openModal(project);
    });
  });
}


/*
  Builds the complete machining-project layout.
*/
function renderMachiningProjects(container, projects) {
  const airMotorProject = projects.find(project => project.id === 'mach-001');

  const machiningSection = document.createElement('section');
  machiningSection.className = 'machining-projects-layout';

  machiningSection.innerHTML = `
    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Air Motor</h2>

        <p>
          A machined pneumatic motor produced from aluminum, brass,
          tool steel, and stainless steel components.
        </p>
      </div>

      <div class="air-motor-media">

        <model-viewer
          class="air-motor-model"
          src="/assets/images/Air_Motor_Content/Portfolio_Air_Motor.glb"
          alt="Interactive 3D model of the completed air motor"
          camera-controls
          auto-rotate
          shadow-intensity="1">
        </model-viewer>

        <img
          src="/assets/images/Air_Motor_Content/Air_Motor_Working.gif"
          alt="Completed air motor operating">

      </div>

      <div
        class="project-slideshow project-slideshow-small"
        data-slideshow="air-motor">

        <h3>Air Motor Manufacturing Progress</h3>

        <p class="slideshow-description">
          Progress shown in chronological order.
        </p>

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <img
              src="/assets/images/Air_Motor_Content/Air_Motor_parts_1.jpeg"
              alt="First group of machined air motor components">

            <figcaption>
              1. Initial machined components
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Air_Motor_Content/Air_Motor_Parts_2.jpeg"
              alt="Additional machined air motor components">

            <figcaption>
              2. Additional completed components
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Air_Motor_Content/Air_Motor_Fully_Assembled.jpg"
              alt="Fully assembled air motor">

            <figcaption>
              3. Fully assembled air motor
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Air Motor slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 3
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Air Motor slide">
            Next &#10095;
          </button>
        </div>

      </div>

      ${
        airMotorProject
          ? `
            <p class="machining-details-button">
              <button class="btn air-motor-details-button" type="button">
                View Air Motor Details
              </button>
            </p>
          `
          : ''
      }

    </article>


    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Titan-76M</h2>

        <p>
          Chronological machining progress from the first operation
          through the completed component.
        </p>
      </div>

      <div
        class="project-slideshow project-slideshow-large"
        data-slideshow="titan-76m">

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="/assets/images/Titan-76M-Content/Titan_76M_OP1_Roughing_Video.MOV"
                type="video/quicktime">
              Your browser does not support this video.
            </video>

            <figcaption>
              1. Operation 1 rough machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Titan-76M-Content/Titan_76M_OP1_Finished.jpeg"
              alt="Titan-76M after completion of operation 1">

            <figcaption>
              2. Operation 1 completed
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Titan-76M-Content/Titan_76M_OP2_Roughed.jpeg"
              alt="Titan-76M during operation 2 rough machining">

            <figcaption>
              3. Operation 2 rough-machined condition
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="/assets/images/Titan-76M-Content/Titan_76M_OP2_Roughing_Video.MOV"
                type="video/quicktime">
              Your browser does not support this video.
            </video>

            <figcaption>
              4. Operation 2 rough machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Titan-76M-Content/Titan_76M_OP2_Finished.jpeg"
              alt="Titan-76M after completion of operation 2">

            <figcaption>
              5. Operation 2 completed
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Titan-76M-Content/Titan_76M_Finished.jpeg"
              alt="Completed Titan-76M component">

            <figcaption>
              6. Finished Titan-76M component
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Titan-76M slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 6
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Titan-76M slide">
            Next &#10095;
          </button>
        </div>

      </div>

    </article>


    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Arts &amp; Sciences Machine Shop Sign</h2>

        <p>
          Development of the machine-shop sign from the original CAD
          concept through setup, machining, finishing, and final assembly.
        </p>
      </div>

      <div
        class="project-slideshow project-slideshow-large"
        data-slideshow="machine-shop-sign">

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <img
              src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_CAD_Concept.jpeg"
              alt="Original CAD concept for the Arts and Sciences Machine Shop sign">

            <figcaption>
              1. Original CAD concept
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP1_Finished.jpeg"
              alt="Machine Shop sign after completion of operation 1">

            <figcaption>
              2. Operation 1 completed
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Set_up.jpeg"
              alt="Machine Shop sign operation 2 setup">

            <figcaption>
              3. Operation 2 setup
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Rough_Video.MOV"
                type="video/quicktime">
              Your browser does not support this video.
            </video>

            <figcaption>
              4. Operation 2 rough machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Semi_Rough.jpeg"
              alt="Machine Shop sign after semi-rough machining">

            <figcaption>
              5. Operation 2 semi-rough condition
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Semi_Finish_Video.MOV"
                type="video/quicktime">
              Your browser does not support this video.
            </video>

            <figcaption>
              6. Operation 2 semi-finish machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Finished_Video.MOV"
                type="video/quicktime">
              Your browser does not support this video.
            </video>

            <figcaption>
              7. Final operation 2 machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="/assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign.jpg"
              alt="Completed Arts and Sciences Machine Shop sign">

            <figcaption>
              8. Completed Arts &amp; Sciences Machine Shop sign
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Machine Shop Sign slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 8
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Machine Shop Sign slide">
            Next &#10095;
          </button>
        </div>

      </div>

    </article>
  `;

  container.appendChild(machiningSection);

  if (airMotorProject) {
    machiningSection
      .querySelector('.air-motor-details-button')
      ?.addEventListener('click', () => {
        openModal(airMotorProject);
      });
  }

  initializeSlideshows(machiningSection);
}


/*
  Activates every slideshow inside the supplied section.
*/
function initializeSlideshows(section) {
  const slideshows = section.querySelectorAll('.project-slideshow');

  slideshows.forEach(slideshow => {
    const slides = Array.from(
      slideshow.querySelectorAll('.slideshow-slide')
    );

    const previousButton = slideshow.querySelector(
      '.slideshow-previous'
    );

    const nextButton = slideshow.querySelector(
      '.slideshow-next'
    );

    const counter = slideshow.querySelector(
      '.slideshow-counter'
    );

    let currentSlide = 0;

    function showSlide(newIndex) {
      /*
        Wrap around when the viewer reaches either end.
      */
      if (newIndex < 0) {
        currentSlide = slides.length - 1;
      } else if (newIndex >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = newIndex;
      }

      slides.forEach((slide, index) => {
        const isActive = index === currentSlide;

        slide.classList.toggle('active', isActive);
        slide.setAttribute(
          'aria-hidden',
          isActive ? 'false' : 'true'
        );

        /*
          Stop videos when the user leaves a slide.
        */
        if (!isActive) {
          slide.querySelectorAll('video').forEach(video => {
            video.pause();
          });
        }
      });

      counter.textContent =
        `${currentSlide + 1} / ${slides.length}`;
    }

    previousButton.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    showSlide(0);
  });
}

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
});
