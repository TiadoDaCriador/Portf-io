document.getElementById('year').textContent = new Date().getFullYear();

// menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
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
