document.getElementById('year').textContent = new Date().getFullYear();

// links de repositório/demo/vídeo ainda por preencher (href="#", ver TODO em index.html) —
// sem isto, um clique com target="_blank" abre um separador novo só com esta mesma página
document.querySelectorAll('[data-placeholder="true"]').forEach(link => {
  link.addEventListener('click', (e) => e.preventDefault());
});

// menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  // o menu mobile ocupa a página toda — bloqueia o scroll de fundo enquanto está aberto
  document.body.classList.toggle('nav-open', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

// drag-to-scroll no carrossel de projetos
const carousel = document.getElementById('carousel');
let isDown = false, startX, scrollLeft;
carousel.addEventListener('mousedown', (e)=>{
  isDown = true; carousel.style.cursor='grabbing';
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});
['mouseleave','mouseup'].forEach(evt=>carousel.addEventListener(evt, ()=>{isDown=false; carousel.style.cursor='grab';}));
carousel.addEventListener('mousemove', (e)=>{
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
});

// navegação do carrossel por teclado (setas ← →), depois de o focar com Tab
carousel.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const card = carousel.querySelector('.card');
  const step = card ? card.offsetWidth + 20 : 320; // largura do card + gap
  carousel.scrollBy({ left: e.key === 'ArrowRight' ? step : -step, behavior: 'smooth' });
});

// setas prev/next visíveis
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
function getStep() {
  const c = carousel.querySelector('.card');
  return c ? c.offsetWidth + 20 : 320;
}
function updateCarouselBtns() {
  carouselPrev.disabled = carousel.scrollLeft <= 0;
  carouselNext.disabled = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 1;
}
carouselPrev.addEventListener('click', () => { carousel.scrollBy({ left: -getStep(), behavior: 'smooth' }); });
carouselNext.addEventListener('click', () => { carousel.scrollBy({ left: getStep(), behavior: 'smooth' }); });
carousel.addEventListener('scroll', updateCarouselBtns, { passive: true });
updateCarouselBtns();

// scroll reveal — fade-in + slide-up ao entrar na viewport, uma vez por elemento
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      el.addEventListener('transitionend', () => {
        el.style.willChange = 'auto';
        // liberta a transição de hover original de .card/.contact-tile (que colide
        // em especificidade com .reveal) assim que a entrada termina.
        el.classList.remove('reveal');
      }, { once: true });
      observer.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// reveal letra-a-letra dos títulos principais, ligado ao scroll (GSAP + ScrollTrigger).
// Se o CDN falhar (offline, bloqueado) ou o utilizador preferir menos movimento,
// os títulos ficam como texto simples — sem animação, mas sempre legíveis.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.reveal-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';

    const chars = [...text].map(letter => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = letter === ' ' ? ' ' : letter;
      line.appendChild(span);
      return span;
    });

    gsap.set(chars, { yPercent: 100, opacity: 0 });

    // Só mede posições e cria o ScrollTrigger depois das fontes carregarem — antes
    // disso a página ainda pode não estar na altura final (a fonte de fallback tem
    // métricas diferentes da Bebas Neue), o que desalinhava os cálculos abaixo.
    document.fonts.ready.then(() => {
      // 'top 85%' vira uma posição de scroll absoluta. Se essa posição já ficou
      // para trás à carga da página (scroll 0) — normal para uma linha perto do
      // topo, como em ecrãs altos de telemóvel — o título não deve ficar à espera
      // de um gesto de scroll que pode nem acontecer: mostra-se já completo, sem
      // animação, tal como a 2ª linha do título do hero ("SILVA" por baixo de
      // "TIAGO") já fazia. Só em mobile (mesmo breakpoint ≤800px do resto do
      // site) — no desktop mantém-se sempre o reveal ligado ao scroll, mesmo que
      // por acaso a conta desse "start" negativo numa janela mais baixa.
      const lineTop = line.getBoundingClientRect().top + window.scrollY;
      const naturalStart = lineTop - window.innerHeight * 0.85;
      if (naturalStart < 0 && window.innerWidth <= 800) {
        gsap.set(chars, { yPercent: 0, opacity: 1 });
        return;
      }

      // Para uma linha perto do fundo da página, o "end" ('top 40%') pode exigir
      // mais scroll do que a página tem disponível, e o título nunca chegaria a
      // revelar-se por completo. Faz clamp ao scroll máximo real nesse caso.
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
          // scrub:1 trails the scroll position by up to 1s (deliberately smooth on
          // normal scroll) — on a fast flick/fast scroll that lag reads as letters
          // stuck mid-reveal. fastScrollEnd snaps the tween to completion instantly
          // once scroll speed crosses GSAP's threshold, so it never looks stuck.
          fastScrollEnd: true,
        }
      });
    });
  });
}
