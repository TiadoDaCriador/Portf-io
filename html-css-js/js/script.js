const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- tema claro/escuro ----------------------------------------------------
// O valor inicial é definido por theme.js (no <head>, antes do paint); aqui só
// se trata do botão. A escolha manual fica guardada, a preferência do sistema só
// vale enquanto não houver escolha.
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const root = document.documentElement;
  const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  const syncTheme = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', dark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro');
    // a cor da barra do browser acompanha a escolha manual (as duas metas passam a ter o mesmo valor)
    themeMetas.forEach(m => m.setAttribute('content', dark ? '#101014' : '#EDEAE0'));
  };
  syncTheme();
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* modo privado */ }
    syncTheme();
  });
}

// ---- menu (ecrã inteiro) --------------------------------------------------
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Fechar' : 'Menu';
    document.body.classList.toggle('menu-open', open);
    // com o menu aberto o resto da página não deve ser alcançável por Tab
    document.querySelectorAll('main, footer').forEach(el => el.toggleAttribute('inert', open));
  };
  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

// ---- relógios -------------------------------------------------------------
const clocks = document.querySelectorAll('[data-tz]');
if (clocks.length) {
  const formatters = {};
  const formatterFor = (tz) => formatters[tz] ||
    (formatters[tz] = new Intl.DateTimeFormat('pt-PT', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }));
  const tick = () => {
    const now = new Date();
    clocks.forEach(el => {
      const text = formatterFor(el.dataset.tz).format(now);
      if (el.textContent !== text) el.textContent = text;
    });
  };
  tick();
  setInterval(tick, 1000);
}

// ---- seletor de projetos (miniaturas + setas) ----------------------------
const works = [...document.querySelectorAll('.work')];
if (works.length > 1) {
  const thumbs = [...document.querySelectorAll('.thumb')];
  const count = document.getElementById('worksCount');
  const pad = (n) => String(n).padStart(2, '0');
  let current = 0;

  const show = (i) => {
    current = (i + works.length) % works.length;
    works.forEach((work, k) => { work.hidden = k !== current; work.classList.toggle('is-active', k === current); });
    thumbs.forEach((thumb, k) => {
      thumb.classList.toggle('is-active', k === current);
      thumb.setAttribute('aria-pressed', String(k === current));
    });
    if (count) count.textContent = `${pad(current + 1)} / ${pad(works.length)}`;
  };

  show(0);
  thumbs.forEach((thumb, k) => thumb.addEventListener('click', () => show(k)));
  document.getElementById('worksPrev').addEventListener('click', () => show(current - 1));
  document.getElementById('worksNext').addEventListener('click', () => show(current + 1));
}

// ---- scroll reveal: fade-in + slide-up, uma vez por elemento ---------------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      el.addEventListener('transitionend', () => {
        el.style.willChange = 'auto';
        // liberta a transição de hover original (a de .reveal colide em
        // especificidade com a de .btn/.contact-row) assim que a entrada termina.
        el.classList.remove('reveal');
      }, { once: true });
      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---- reveal letra-a-letra dos títulos gigantes (GSAP + ScrollTrigger) ----------
// Ligado ao scroll (scrub). Se o CDN falhar ou o utilizador preferir menos
// movimento, os títulos ficam como texto simples — sempre legíveis.
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.reveal-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';

    const chars = [...text].map(letter => {
      const span = document.createElement('span');
      span.className = 'char';
      // espaço normal colapsava dentro do inline-block e "vamos falar" ficava "vamosfalar"
    span.textContent = letter === ' ' ? ' ' : letter;
      line.appendChild(span);
      return span;
    });

    gsap.set(chars, { yPercent: 110, opacity: 0 });

    // Só mede depois das fontes carregarem: antes disso a página ainda não tem a
    // altura final (a fonte de fallback tem métricas diferentes da Archivo) e o
    // clamp abaixo ficaria desalinhado.
    document.fonts.ready.then(() => {
      // 'top 85%' vira uma posição de scroll absoluta. Se já ficou para trás à carga
      // (scroll 0) — linha perto do topo em ecrãs altos de telemóvel — o título
      // mostra-se logo completo em vez de esperar por um scroll que pode não vir.
      // Só em mobile (≤800px); no desktop mantém-se sempre o reveal ligado ao scroll.
      const lineTop = line.getBoundingClientRect().top + window.scrollY;
      const naturalStart = lineTop - window.innerHeight * 0.85;
      if (naturalStart < 0 && window.innerWidth <= 800) {
        gsap.set(chars, { yPercent: 0, opacity: 1 });
        return;
      }

      // Perto do fundo da página o 'end' pode exigir mais scroll do que existe e o
      // título nunca se revelaria por completo: faz clamp ao scroll máximo real.
      const naturalEnd = lineTop - window.innerHeight * 0.40;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          end: naturalEnd > maxScroll ? Math.max(maxScroll, 1) : 'top 40%',
          scrub: 1,
          // scrub:1 atrasa até 1s em relação ao scroll; num scroll rápido isso lê-se
          // como letras presas a meio. fastScrollEnd completa a animação de imediato.
          fastScrollEnd: true,
        }
      });
    });
  });
}

// ---- galeria de screenshots (lightbox), nas páginas de projeto ----------------
// O contentor [data-gallery] guarda as imagens e legendas; cada .shot dentro dele
// abre a galeria na sua posição.
const galleries = document.querySelectorAll('[data-gallery]');
if (galleries.length) {
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Galeria de imagens');
  overlay.innerHTML = `
    <button type="button" class="gallery-close" aria-label="Fechar galeria">✕</button>
    <button type="button" class="gallery-prev" aria-label="Imagem anterior">←</button>
    <figure class="gallery-figure">
      <img class="gallery-image" src="" alt="">
      <figcaption class="gallery-caption"></figcaption>
      <span class="gallery-counter"></span>
    </figure>
    <button type="button" class="gallery-next" aria-label="Imagem seguinte">→</button>
  `;
  document.body.appendChild(overlay);

  const galleryImage = overlay.querySelector('.gallery-image');
  const galleryCaption = overlay.querySelector('.gallery-caption');
  const galleryCounter = overlay.querySelector('.gallery-counter');
  let images = [];
  let alts = [];
  let title = '';
  let index = 0;
  let lastFocused = null;

  const render = () => {
    galleryImage.src = images[index];
    galleryImage.alt = `${title}: ${alts[index] || ''}`;
    galleryCaption.textContent = alts[index] || '';
    galleryCounter.textContent = `${index + 1} / ${images.length}`;
  };

  const openGallery = (container, start) => {
    images = JSON.parse(container.dataset.gallery || '[]');
    alts = JSON.parse(container.dataset.galleryAlt || '[]');
    title = container.dataset.galleryTitle || '';
    if (!images.length) return;
    index = start;
    lastFocused = document.activeElement;
    render();
    overlay.classList.add('open');
    document.body.classList.add('gallery-open');
    overlay.querySelector('.gallery-close').focus();
  };

  const closeGallery = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('gallery-open');
    if (lastFocused) lastFocused.focus();
  };

  const step = (delta) => {
    index = (index + delta + images.length) % images.length;
    render();
  };

  galleries.forEach(container => {
    const shots = [...container.querySelectorAll('.shot')];
    shots.forEach((shot, k) => shot.addEventListener('click', () => openGallery(container, k)));
  });
  overlay.querySelector('.gallery-close').addEventListener('click', closeGallery);
  overlay.querySelector('.gallery-prev').addEventListener('click', () => step(-1));
  overlay.querySelector('.gallery-next').addEventListener('click', () => step(1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGallery(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeGallery();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
}
