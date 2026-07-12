# Portfólio — Tiago Silva

Portfólio de uma página, em português de Portugal, para candidaturas a emprego,
freelance ou a próxima oportunidade em desenvolvimento mobile/web.

```
portfolio-tiago-silva/
└── html-css-js/          → site estático, pronto a publicar já
    ├── index.html
    ├── css/styles.css
    └── js/script.js
```

Não precisa de build nem de instalar nada. Basta abrir o `index.html` num
browser, ou arrastar a pasta para um serviço como Netlify, Vercel ou GitHub
Pages. É a forma mais rápida de teres o portfólio online ainda hoje.

> Nota: este repositório teve, no início, uma segunda versão em
> `ionic-angular/` (componentes Angular standalone com o mesmo conteúdo).
> Foi removida por não estar a ser mantida em sincronia e não ter deploy
> próprio — continua recuperável no histórico do git (commit inicial) se
> um dia fizer sentido retomá-la.

## 1. Como publicar

### Firebase Hosting — já configurado neste repo (recomendado)

O repo inclui `firebase.json` (serve a pasta `html-css-js`, com headers de
segurança e de cache) e `.firebaserc`. Para publicar de graça (plano Spark:
HTTPS automático, 10 GB de armazenamento, ~360 MB/dia de tráfego):

1. Cria um projeto em [console.firebase.google.com](https://console.firebase.google.com)
   **com o Google Analytics ativado** (cria logo a propriedade GA4).
2. Atualiza o id do projeto em `.firebaserc` (o atual, `portfolio-tiago-silva`,
   é um placeholder — usa o id real que a consola te der).
3. Instala a CLI e publica:
   ```
   npm install -g firebase-tools
   firebase login
   firebase deploy --only hosting
   ```
4. O site fica em `https://<id-do-projeto>.web.app`. Podes ligar um domínio
   próprio em Hosting → Add custom domain.

Para testar localmente antes de publicar: `firebase emulators:start --only hosting`.

### GitHub Pages — também automatizado neste repo (alternativa ao Firebase)

Não precisa de conta Google/Firebase — só de um repositório no GitHub. O
Google Analytics funciona da mesma forma em qualquer alojamento (é só um
`<script>`, não depende do Firebase — ver `analytics.js`), por isso não perdes
isso ao escolher esta opção. O que perdes, por não ter `firebase.json`, são os
headers de segurança (CSP, `X-Frame-Options`, etc. — ver "Segurança e
manutenção" abaixo).

1. Cria um repositório no GitHub e faz push deste projeto (`git remote add
   origin <url> && git push -u origin master`) — este repo ainda só existe
   localmente (`git init`), não tem remote configurado.
2. Nas definições do repositório: **Settings → Pages → Build and deployment
   → Source: "GitHub Actions"**.
3. `.github/workflows/pages.yml` já está pronto: a cada push a `master`,
   publica `html-css-js/` no GitHub Pages automaticamente (usa a Action
   oficial `actions/deploy-pages`, sem precisar de branch `gh-pages`).
4. O site fica em `https://<utilizador>.github.io/<repositório>/` (ou
   `https://<utilizador>.github.io/` se o repo se chamar
   `<utilizador>.github.io`). Domínio próprio: Settings → Pages → Custom domain.

Nada impede correr os dois em paralelo (Firebase + GitHub Pages) — os
workflows são independentes.

### Google Analytics 4 (com consentimento RGPD)

O ficheiro `html-css-js/js/analytics.js` já traz tudo: Consent Mode v2 com
banner de consentimento em PT (o gtag.js **só carrega depois de o visitante
aceitar** — sem consentimento não sai nenhum pedido para a Google) e eventos
personalizados (`contact_click`, `cta_click`, `section_view`,
`carousel_interaction`).

Falta só uma coisa: substituir o placeholder `G-XXXXXXXXXX` no topo de
`analytics.js` pelo Measurement ID real (Firebase console → Definições do
projeto → Integrações → Google Analytics). Enquanto for placeholder, o banner
nem aparece e nada é enviado. Depois de configurado, confirma os eventos em
GA4 → Admin → DebugView.

### Deploy automático (GitHub Actions)

- `.github/workflows/ci.yml` — valida o HTML (`html-validate`) e corre o
  Lighthouse CI (mínimo 0.9 em acessibilidade/best-practices/SEO) a cada push.
- `.github/workflows/deploy.yml` — publica no Firebase Hosting a cada push a
  `master`, e cria um canal de pré-visualização por cada pull request.
  Requer o secret `FIREBASE_SERVICE_ACCOUNT` no repositório GitHub — a forma
  mais fácil de o criar é correr `firebase init hosting:github` uma vez, que
  gera a service account e o secret automaticamente. Atualiza também o
  `projectId` nos dois jobs se o id do projeto for outro.
- `.github/workflows/pages.yml` — publica no GitHub Pages a cada push a
  `master` (ver secção acima). Não precisa de nenhum secret — só de ativar
  "GitHub Actions" como source em Settings → Pages, uma vez.

### Notas de domínio nos metadados

`index.html` (canonical, `og:url`, `og:image`), `robots.txt` e `sitemap.xml`
usam `https://tiagosilva.dev` como placeholder. Troca pelo domínio real que
vieres a usar — `https://<id-do-projeto>.web.app` (Firebase) ou
`https://<utilizador>.github.io/<repositório>/` (GitHub Pages) — nesses três
ficheiros.

### Outras alternativas gratuitas

- **Netlify / Vercel** — arrasta a pasta `html-css-js` para o site deles, ou
  liga a um repositório GitHub para deploy automático a cada alteração.
- **Cloudflare Pages** — liga o repositório e aponta o build output para
  `html-css-js` (sem comando de build).

### Segurança e manutenção

- Headers de segurança (CSP, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Frame-Options`) são aplicados pelo Firebase via
  `firebase.json`. A CSP só permite scripts de `self`, do CDN do GSAP e do
  Google Analytics — se adicionares outro script externo, acrescenta o domínio
  à CSP.
  Nota: o **emulador local não aplica** estes headers custom (limitação do
  `firebase-tools`, confirmada nas v13 e v15) — só o Hosting em produção os
  aplica. Depois do primeiro deploy, confirma com `curl -I https://<site>` ou
  em [securityheaders.com](https://securityheaders.com).
- O GSAP está pinado a uma versão com `integrity`/SRI. Para atualizar: muda a
  versão nos dois `<script>` do `index.html` e substitui os hashes `sha384`
  pelos publicados no cdnjs.
- Sem formulários nem backend, a superfície de ataque é mínima. Se um dia
  adicionares um formulário de contacto, usa Firebase Functions/Firestore com
  App Check e regras restritivas.
- Checklist manual antes de cada publicação: menu mobile, carrossel (arrasto,
  setas visíveis e teclado), banner de consentimento (aceitar e recusar),
  reveals com `prefers-reduced-motion` ativo, e um relatório Lighthouse no
  Chrome (alvo ≥ 95 nas quatro categorias).

## 2. Antes de publicar — o que tens mesmo de mudar

- **Projetos**: ✅ já mostram os dois projetos reais (App Sócios e Maestro
  Member, feitos durante o estágio na MUsa Software), com números técnicos
  verificáveis (574 testes, 6 ecrãs) em vez de métricas de negócio
  inventadas.
- **Contactos**: ✅ email (`tiago-silva198@hotmail.com`) e GitHub
  (`github.com/TiadoDaCriador`) já são reais. O LinkedIn
  (`linkedin.com/in/tiago-silva-dev`) ainda é placeholder — substitui em
  `index.html` quando tiveres o perfil real.
- **Links dos projetos**: os cards não têm botões de Repositório/Demo/Vídeo
  (removidos a pedido do Tiago). Os repos (`Socios_App`, `Maestro_Member`)
  existem no GitHub mas estão privados/não publicados de propósito — se um
  dia quiseres mostrá-los, tens de decidir tornar os repos públicos e voltar
  a adicionar os links aos cards.

## 3. Sugestões para melhorares depois

- Adicionar uma secção de **certificações ou formação** se tiveres cursos,
  bootcamps ou certificações relevantes (ex: Google Analytics, Firebase).
- Ligar um **domínio próprio** (ex: tiagosilva.dev) em vez do subdomínio
  gratuito do Netlify/Vercel — reforça a perceção profissional.
- Adicionar **capturas de ecrã ou GIFs curtos** dos projetos nos cards,
  assim que tiveres versões funcionais para mostrar.
- Criar uma versão em **inglês** do mesmo site (útil se te candidatares a
  empresas internacionais ou remotas).
- ~~Adicionar **Google Analytics ou Plausible** ao próprio portfólio~~ —
  feito: GA4 com Consent Mode já está integrado (ver secção 1), falta só o
  Measurement ID real.
- Considerar um **CV em PDF** para download a partir do botão "Contactar"
  ou da secção de contacto.
- Validar acessibilidade e performance com o **Lighthouse** do Chrome antes
  de publicar a versão final.

## 4. Notas técnicas

- Tipografia: Bebas Neue nos títulos + Inter no corpo de texto (Google Fonts).
- Sem frameworks CSS externos — CSS puro com custom properties (`:root` em
  `css/styles.css`), para manter o site leve e rápido.
- Cores, espaçamentos e sombras estão centralizados em tokens (`:root` no CSS).
- O menu mobile (dropdown), o drag-to-scroll do carrossel de projetos e o
  ano automático no rodapé estão implementados em JavaScript puro
  (`js/script.js`), sem dependências.
- **Scroll reveal**: títulos, parágrafos e cards fazem fade-in/slide-up ao
  entrar na viewport (Intersection Observer nativo, `.reveal`/`.is-visible`,
  sem dependências, em `js/script.js`). Os títulos principais (hero +
  títulos de secção) têm ainda um reveal letra-a-letra ligado à posição do
  scroll, via **GSAP + ScrollTrigger** — a única dependência externa do
  projeto, carregada por CDN (com `integrity`/SRI) em `index.html`. Se o CDN
  falhar ou o utilizador preferir menos movimento
  (`prefers-reduced-motion`), os títulos ficam como texto simples, sempre
  legíveis.
