import '../js/inner-navigation.js';

import {
  commercialBrandCampaigns,
  commercialEditorialProjects,
  commercialSelectedImages,
  commercialStillLifeCollections,
  creativeProductionProjects,
  fashionProjects,
  getProject,
  personalPortraitProjects,
  projects,
} from './projects-data.js';

const categoryLabels = {
  fashion: 'Fashion / Selected Projects',
  commercial: 'Selected commercial works across fashion, product and editorial assignments.',
  portrait: 'Portrait Photography / Selected Projects',
  'creative-production': 'Creative Production / Selected Projects',
};

function picture(image, options = {}) {
  const loading = options.priority ? '' : ' loading="lazy"';
  const priority = options.priority ? ' fetchpriority="high"' : '';
  const sizes = options.sizes || '(max-width: 760px) 100vw, 84vw';
  return `
    <picture>
      <source type="image/webp" srcset="${image.small} 900w, ${image.large} 1800w" sizes="${sizes}" />
      <img src="${image.large}" srcset="${image.small} 900w, ${image.large} 1800w" sizes="${sizes}" alt="${image.alt}"${loading}${priority} decoding="async" />
    </picture>
  `;
}

function commercialProjectCard(project, index = 0) {
  return `
    <article class="archive-card commercial-project-card" data-project-category="commercial" data-reveal>
      <a class="archive-card__link" href="/leona-li/work/${project.slug}/" aria-label="Open ${project.title} project">
        <span class="archive-card__media">
          ${picture(project.cover, { priority: index === 0 })}
          <span class="archive-card__overlay">
            <strong>${project.title}</strong>
            <span>${project.category}</span>
            ${project.year ? `<span>${project.year}</span>` : ''}
            <span class="archive-card__view">View Gallery</span>
          </span>
        </span>
        <span class="archive-card__caption">
          <span class="archive-card__number">${project.number}</span>
          <strong>${project.title}</strong>
          <span class="archive-card__category">${project.category}</span>
          ${project.year ? `<span class="archive-card__year">${project.year}</span>` : ''}
        </span>
      </a>
    </article>
  `;
}

function commercialImageWall(images, label, options = {}) {
  const className = options.compact ? ' commercial-image-wall--compact' : '';
  const itemBase = options.itemBase || label;
  const category = options.category || 'Commercial Image';
  return `
    <div class="commercial-image-wall${className}" aria-label="${label}">
      ${images.map((image, index) => {
        const number = String(index + 1).padStart(2, '0');
        const title = `${itemBase} ${number}`;
        return `
        <figure class="commercial-image" data-reveal>
          <span class="commercial-image__media">
            ${picture(image)}
            <span class="commercial-image__overlay">
              <strong>${title}</strong>
              <span>${category}</span>
              ${options.year ? `<span>${options.year}</span>` : ''}
            </span>
          </span>
          <figcaption>${number} / ${title} / ${category}</figcaption>
        </figure>
      `;
      }).join('')}
    </div>
  `;
}

function renderCommercialArchive(archive) {
  document.body.classList.add('work-page--commercial');
  document.title = 'Commercial Works — Leona Li';

  const label = document.querySelector('.work-intro__label');
  const title = document.querySelector('#work-title');
  const footerLabel = document.querySelector('.work-intro__footer .work-intro__label');
  const context = document.querySelector('[data-work-context]');
  if (label) label.textContent = 'Commercial / Photographer Archive';
  if (title) title.innerHTML = '<span>Commercial</span><span>Works</span>';
  if (footerLabel) footerLabel.textContent = 'Leona Li / Photographer';
  if (context) context.textContent = 'Selected commercial works across fashion, product and editorial assignments.';

  archive.setAttribute('aria-label', 'Commercial photography archive');
  archive.innerHTML = `
    <nav class="commercial-directory" aria-label="Commercial archive sections" data-reveal>
      <p>Archive Navigation / 01—04</p>
      <ol>
        <li><a href="#brand-campaigns"><span>01</span>Brand Campaigns</a></li>
        <li><a href="#selected-works"><span>02</span>Selected Works</a></li>
        <li><a href="#product-still-life"><span>03</span>Product &amp; Still Life</a></li>
        <li><a href="#editorial-stories"><span>04</span>Editorial Stories</a></li>
      </ol>
    </nav>

    <section class="commercial-section" id="brand-campaigns" aria-labelledby="brand-campaigns-title">
      <header class="commercial-section__header" data-reveal>
        <p>01 / Image Series</p>
        <div>
          <h2 id="brand-campaigns-title">Brand Campaigns</h2>
          <p>Selected brand campaigns, lifestyle stories and fashion commissions.</p>
        </div>
      </header>
      <div class="commercial-project-grid">
        ${commercialBrandCampaigns.map(commercialProjectCard).join('')}
      </div>
    </section>

    <section class="commercial-section" id="selected-works" aria-labelledby="selected-works-title">
      <header class="commercial-section__header" data-reveal>
        <p>02 / Image Archive</p>
        <div>
          <h2 id="selected-works-title">Selected Works</h2>
          <p>Selected fashion, lifestyle and brand images.</p>
        </div>
      </header>
      ${commercialImageWall(commercialSelectedImages, 'Selected Works', { itemBase: 'Selected Work', category: 'Commercial Image' })}
    </section>

    <section class="commercial-section" id="product-still-life" aria-labelledby="product-still-life-title">
      <header class="commercial-section__header" data-reveal>
        <p>03 / Object Archive</p>
        <div>
          <h2 id="product-still-life-title">Product &amp; Still Life</h2>
          <p>Commercial image-making through controlled light, material and detail.</p>
        </div>
      </header>
      <div class="commercial-still-life">
        ${commercialStillLifeCollections.map((collection) => `
          <section class="commercial-collection" aria-labelledby="${collection.title.toLowerCase().replace(/\s+/g, '-')}-title">
            <header class="commercial-collection__header" data-reveal>
              <p>${collection.number}</p>
              <div>
                <h3 id="${collection.title.toLowerCase().replace(/\s+/g, '-')}-title">${collection.title}</h3>
                <p>${collection.description}</p>
              </div>
            </header>
            ${commercialImageWall(collection.images, collection.title, {
              compact: collection.images.length < 4,
              itemBase: collection.title === 'Product Studies' ? 'Product Study' : 'Beauty Still Life',
              category: 'Product & Still Life',
            })}
          </section>
        `).join('')}
      </div>
    </section>

    <section class="commercial-section" id="editorial-stories" aria-labelledby="editorial-stories-title">
      <header class="commercial-section__header" data-reveal>
        <p>04 / Complete Series</p>
        <div>
          <h2 id="editorial-stories-title">Editorial Stories</h2>
          <p>Selected editorial image series and commissioned stories.</p>
        </div>
      </header>
      <div class="commercial-project-grid commercial-project-grid--editorial">
        ${commercialEditorialProjects.map(commercialProjectCard).join('')}
      </div>
    </section>
  `;
}

function renderArchive() {
  const archive = document.querySelector('[data-work-archive]');
  if (!archive) return;

  const category = new URLSearchParams(window.location.search).get('category');
  if (category === 'commercial') {
    renderCommercialArchive(archive);
    return;
  }

  const archiveGroups = [
    {
      category: 'fashion',
      heading: 'Fashion Photography',
      projects: fashionProjects,
    },
    {
      category: 'portrait',
      heading: 'Portrait Photography',
      projects: personalPortraitProjects,
    },
    {
      category: 'creative-production',
      heading: 'Creative Production',
      projects: creativeProductionProjects,
    },
  ];

  archive.innerHTML = `
    ${archiveGroups.map((group, groupIndex) => `
      <section class="archive-group archive-group--${group.category}" data-category-group="${group.category}" aria-labelledby="${group.category}-heading">
        <header class="archive-group__header">
          <h2 id="${group.category}-heading">${group.heading}</h2>
          <p>${String(group.projects.length).padStart(2, '0')} Projects</p>
        </header>
        <div class="archive-grid">
          ${group.projects.map((project, index) => `
            <article class="archive-card${project.slug === 'karl-lagerfeld-ss25' ? ' archive-card--featured' : ''}" data-project-category="${project.filter}" data-reveal>
              <a class="archive-card__link" href="/leona-li/work/${project.slug}/" aria-label="Open ${project.title} project">
                <span class="archive-card__media">
                  ${picture(project.cover, { priority: index === 0 })}
                  <span class="archive-card__overlay">
                    <strong>${project.title}</strong>
                    <span>${project.category}</span>
                    <span class="archive-card__overlay-description">${project.description}</span>
                    ${project.roleSummary ? `<span>${project.roleSummary}</span>` : ''}
                    ${project.year ? `<span>${project.year}</span>` : ''}
                    <span class="archive-card__view">View Project</span>
                  </span>
                </span>
                <span class="archive-card__caption">
                  <span class="archive-card__number">${project.number}</span>
                  <strong>${project.title}</strong>
                  <span class="archive-card__category">${project.category}</span>
                  ${project.year ? `<span class="archive-card__year">${project.year}</span>` : ''}
                </span>
              </a>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('')}
    <div class="filter-empty" data-filter-empty hidden>
      <p>This collection is in development. Return to the complete selected archive.</p>
    </div>
  `;
}

function galleryFrame(project, image, index) {
  const number = String(index + 1).padStart(2, '0');
  const alignments = project.filter === 'portrait'
    ? ['full', 'medium', 'full', 'right']
    : ['full', 'right', 'left', 'medium'];
  const alignment = alignments[index % alignments.length];
  return `
    <figure class="project-gallery__frame project-gallery__frame--${alignment}" data-reveal>
      ${picture(image, { priority: index === 0 })}
      <figcaption>Image / ${number}</figcaption>
    </figure>
  `;
}

function projectPagination(project) {
  const siblingProjects = projects.filter((item) => item.filter === project.filter);
  const projectIndex = siblingProjects.indexOf(project);
  const previous = siblingProjects[(projectIndex - 1 + siblingProjects.length) % siblingProjects.length];
  const next = siblingProjects[(projectIndex + 1) % siblingProjects.length];

  return `
    <nav class="project-detail__pagination" aria-label="Project navigation">
      <a href="/leona-li/work/${previous.slug}/">← ${previous.title}</a>
      <a href="/leona-li/work/${next.slug}/">${next.title} →</a>
    </nav>
  `;
}

function creativeFacts(project) {
  return `
    <div class="project-detail__facts project-detail__facts--creative" aria-label="Project information">
      <p><span>Client</span>${project.client}</p>
      <p><span>Project</span>${project.projectName}</p>
      ${project.year ? `<p><span>Year</span>${project.year}</p>` : ''}
      <p><span>Role</span>${project.roleSummary}</p>
    </div>
  `;
}

function creativeHero(project) {
  return `
    <section class="creative-detail__hero" aria-labelledby="project-title">
      <div class="creative-detail__hero-media">
        ${picture(project.gallery[0], { priority: true })}
      </div>
      <div class="creative-detail__hero-copy">
        <p class="project-detail__eyebrow">Creative Production / ${project.number}</p>
        <h1 id="project-title">${project.title}</h1>
      </div>
    </section>
  `;
}

function creativeInformation(project) {
  return `
    <section class="creative-detail__information" aria-labelledby="project-information-title" data-reveal>
      <h2 class="project-detail__eyebrow" id="project-information-title">Project Information</h2>
      ${creativeFacts(project)}
    </section>
  `;
}

function creativeNarrative(project) {
  return `
    <section class="creative-detail__narrative" aria-label="Project context and overview">
      <div data-reveal>
        <h2>Brand Context</h2>
        <p>${project.brandContext}</p>
      </div>
      <div data-reveal>
        <h2>Project Overview</h2>
        <p>${project.projectOverview}</p>
      </div>
    </section>
  `;
}

function renderCreativeCaseStudy(project) {
  const sections = project.sections.map((section, sectionIndex) => {
    const finalImages = sectionIndex === 0 ? section.images.slice(1) : section.images;
    return `
    <section class="creative-case" aria-labelledby="case-${sectionIndex + 1}-title">
      <header class="creative-case__header" data-reveal>
        <p class="project-detail__eyebrow">Part / ${String(sectionIndex + 1).padStart(2, '0')}</p>
        <h2 id="case-${sectionIndex + 1}-title">${section.title}</h2>
      </header>
      <div class="creative-case__information" data-reveal>
        <div>
          <h3>Project Overview</h3>
          <p>${section.description}</p>
        </div>
        <div>
          <h3>Role / Contribution</h3>
          <ul>${section.roles.map((role) => `<li>${role}</li>`).join('')}</ul>
        </div>
        ${section.process ? `
          <div class="creative-case__process">
            <h3>Creative Process</h3>
            <ol>${section.process.map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${item}</li>`).join('')}</ol>
          </div>
        ` : ''}
        ${section.experience ? `
          <div class="creative-case__contribution">
            <h3>Contribution</h3>
            <ul>${section.experience.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
        ` : ''}
      </div>
      <div class="creative-case__sequence project-gallery" aria-label="${section.title} final images">
        <h3 class="project-detail__sequence-label">Final Images / ${String(finalImages.length).padStart(2, '0')}</h3>
        ${finalImages.map((image, imageIndex) => galleryFrame(project, image, imageIndex)).join('')}
      </div>
    </section>
  `;
  }).join('');

  return `
    ${creativeHero(project)}
    ${creativeInformation(project)}
    ${creativeNarrative(project)}
    ${sections}
    ${projectPagination(project)}
  `;
}

function renderCreativeProject(project) {
  const finalImages = project.gallery.slice(1);
  return `
    ${creativeHero(project)}
    ${creativeInformation(project)}
    ${creativeNarrative(project)}

    <section class="creative-profile" aria-label="Creative production scope" data-reveal>
      <div>
        <h2>Role / Contribution</h2>
        <ul>${project.roles.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    </section>

    <section class="project-detail__sequence project-gallery" aria-labelledby="sequence-title">
      <h2 class="project-detail__sequence-label" id="sequence-title">Final Images / ${String(finalImages.length).padStart(2, '0')}</h2>
      ${finalImages.map((image, index) => galleryFrame(project, image, index)).join('')}
    </section>

    ${projectPagination(project)}
  `;
}

function renderDetail() {
  const detail = document.querySelector('[data-project-detail]');
  const slug = document.body.dataset.projectSlug;
  if (!detail || !slug) return;

  const project = getProject(slug);
  if (!project) {
    detail.innerHTML = '<p class="project-detail__error">Project not found.</p>';
    return;
  }

  detail.classList.toggle('project-detail--portrait', project.filter === 'portrait');
  detail.classList.toggle('project-detail--commercial', project.filter === 'commercial');
  detail.classList.toggle('project-detail--creative-production', project.filter === 'creative-production');
  document.body.classList.toggle('work-page--creative-production', project.filter === 'creative-production');
  document.title = `${project.title} — Leona Li`;

  if (project.filter === 'creative-production') {
    detail.innerHTML = project.sections ? renderCreativeCaseStudy(project) : renderCreativeProject(project);
    return;
  }

  if (project.filter === 'commercial') {
    detail.innerHTML = `
      <section class="project-detail__intro" aria-labelledby="project-title">
        <p class="project-detail__eyebrow">Commercial Archive / ${project.number}</p>
        <div class="project-detail__heading">
          <h1 id="project-title">${project.title}</h1>
          <div class="project-detail__facts" aria-label="Project information">
            <p><span>Category</span>${project.category}</p>
            ${project.year ? `<p><span>Year</span>${project.year}</p>` : ''}
          </div>
        </div>
      </section>

      <section class="project-detail__sequence project-gallery" aria-labelledby="sequence-title">
        <h2 class="project-detail__sequence-label" id="sequence-title">Image Gallery / 01—${String(project.gallery.length).padStart(2, '0')}</h2>
        ${project.gallery.map((image, index) => galleryFrame(project, image, index)).join('')}
      </section>

      ${projectPagination(project)}
    `;
    return;
  }

  detail.innerHTML = `
    <section class="project-detail__intro" aria-labelledby="project-title">
      <p class="project-detail__eyebrow">Project / ${project.number}</p>
      <div class="project-detail__heading">
        <h1 id="project-title">${project.title}</h1>
        <div class="project-detail__facts" aria-label="Project information">
          <p><span>Category</span>${project.category}</p>
          ${project.year ? `<p><span>Year</span>${project.year}</p>` : ''}
        </div>
      </div>
    </section>

    <section class="project-detail__statement" aria-labelledby="statement-title" data-reveal>
      <h2 class="project-detail__eyebrow" id="statement-title">Project Note</h2>
      <p>${project.description}</p>
    </section>

    <section class="project-detail__sequence project-gallery" aria-labelledby="sequence-title">
      <h2 class="project-detail__sequence-label" id="sequence-title">Image Sequence / 01—${String(project.gallery.length).padStart(2, '0')}</h2>
      ${project.gallery.map((image, index) => galleryFrame(project, image, index)).join('')}
    </section>

    ${projectPagination(project)}
  `;
}

function applyCategoryFilter() {
  const cards = [...document.querySelectorAll('[data-project-category]')];
  const groups = [...document.querySelectorAll('[data-category-group]')];
  if (!cards.length) return;

  const category = new URLSearchParams(window.location.search).get('category');
  if (!category || !categoryLabels[category]) return;

  document.body.classList.toggle('work-page--creative-production', category === 'creative-production');

  const context = document.querySelector('[data-work-context]');
  if (context) context.textContent = categoryLabels[category];

  groups.forEach((group) => {
    group.hidden = group.dataset.categoryGroup !== category;
  });

  let visibleCount = 0;
  cards.forEach((card) => {
    const visible = card.dataset.projectCategory.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const empty = document.querySelector('[data-filter-empty]');
  if (empty) empty.hidden = visibleCount > 0;
}

function mountReveal() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  items.forEach((item) => observer.observe(item));
}

renderArchive();
renderDetail();
applyCategoryFilter();
mountReveal();
