// Corre no <head>, antes do primeiro paint, para o tema certo aparecer logo
// (sem flash). É um ficheiro externo porque a CSP não permite scripts inline.
// Escolha guardada > preferência do sistema. O botão de alternar está em script.js.
(function () {
  var root = document.documentElement;
  var theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) { /* modo privado */ }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
  root.classList.add('js');
})();
