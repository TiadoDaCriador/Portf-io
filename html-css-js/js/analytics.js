// Google Analytics 4 com Consent Mode v2.
// O gtag.js só é carregado DEPOIS de o visitante aceitar no banner (RGPD/UE):
// sem consentimento não sai nenhum pedido para os servidores da Google.
//
// Substitui pelo Measurement ID real da propriedade GA4 (Firebase console →
// Definições do projeto → Integrações → Google Analytics, formato G-XXXXXXXXXX).
const GA_MEASUREMENT_ID = 'G-JSGN6T85G';

const CONSENT_KEY = 'analytics-consent'; // 'granted' | 'denied'

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

// Default: tudo negado até haver escolha explícita (Consent Mode v2).
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});

const gaConfigured = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';

function loadGa(){
  if (!gaConfigured || document.getElementById('gtagScript')) return;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
  const s = document.createElement('script');
  s.id = 'gtagScript';
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
}

// ---- Banner de consentimento -------------------------------------------
function showConsentBanner(){
  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Consentimento de cookies de estatística');
  banner.innerHTML =
    '<p>Este site usa o Google Analytics para perceber como é visitado. ' +
    'Só é ativado se aceitares — nenhum dado é recolhido sem o teu consentimento.</p>' +
    '<div class="consent-actions">' +
    '<button type="button" class="btn btn-primary" id="consentAccept">Aceitar</button>' +
    '<button type="button" class="btn btn-ghost" id="consentReject">Recusar</button>' +
    '</div>';
  document.body.appendChild(banner);

  const close = (choice) => {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (e) { /* modo privado */ }
    banner.remove();
    if (choice === 'granted') loadGa();
  };
  banner.querySelector('#consentAccept').addEventListener('click', () => close('granted'));
  banner.querySelector('#consentReject').addEventListener('click', () => close('denied'));
}

let stored = null;
try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { /* modo privado */ }

if (stored === 'granted') {
  loadGa();
} else if (stored !== 'denied' && gaConfigured) {
  // só faz sentido pedir consentimento quando o GA está mesmo configurado
  showConsentBanner();
}

// ---- Eventos personalizados ---------------------------------------------
// Enquanto o consentimento não for dado, gtag() só empilha no dataLayer local
// (nada é enviado); depois de loadGa() os eventos seguintes contam no GA4.

// Cliques nos contactos (email / LinkedIn / GitHub)
document.querySelectorAll('.contact-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const method = tile.querySelector('.tag');
    gtag('event', 'contact_click', { method: method ? method.textContent.toLowerCase() : 'desconhecido' });
  });
});

// Cliques nos CTAs do hero
document.querySelectorAll('.hero-actions a').forEach(cta => {
  cta.addEventListener('click', () => {
    gtag('event', 'cta_click', { cta: cta.textContent.trim() });
  });
});

// Visualização de secções (uma vez por sessão de página)
if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('#sobre, #projetos, #competencias, #contacto');
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gtag('event', 'section_view', { section: entry.target.id });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
}

// Primeira interação com o carrossel de projetos (um único evento, seja qual
// for o tipo de input)
const carouselEl = document.getElementById('carousel');
if (carouselEl) {
  let carouselTracked = false;
  ['mousedown', 'touchstart', 'keydown'].forEach(evt => {
    carouselEl.addEventListener(evt, () => {
      if (carouselTracked) return;
      carouselTracked = true;
      gtag('event', 'carousel_interaction', { input: evt });
    }, { once: true, passive: true });
  });
}
