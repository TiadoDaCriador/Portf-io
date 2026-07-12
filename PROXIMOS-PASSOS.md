# Próximos passos — o que falta fazer

Checklist do que ficou pendente depois da integração com Firebase Hosting + GA4
(ver `README.md` secção 1 para o detalhe de cada passo). São tudo ações que
exigem a tua conta Google/GitHub, por isso não podiam ser feitas automaticamente.

## 1. Firebase + Analytics

- [ ] Criar projeto em [console.firebase.google.com](https://console.firebase.google.com)
      **com o Google Analytics ativado** (cria logo a propriedade GA4).
- [ ] Atualizar o id do projeto em `.firebaserc` (troca o placeholder
      `portfolio-tiago-silva` pelo id real).
- [ ] Substituir `G-XXXXXXXXXX` pelo Measurement ID real no topo de
      `html-css-js/js/analytics.js` (Firebase console → Definições do projeto
      → Integrações → Google Analytics). Sem isto o banner de consentimento
      nem aparece e nada é enviado.
- [ ] `npm install -g firebase-tools` → `firebase login` →
      `firebase deploy --only hosting`.
- [ ] Depois do deploy, confirmar os headers de segurança (o emulador local
      não os aplica): `curl -I https://<site>.web.app` ou
      [securityheaders.com](https://securityheaders.com).
- [ ] Confirmar eventos do GA4 em Admin → DebugView, depois de aceitar o
      banner de consentimento no site publicado.

## 2. Publicar no GitHub (opcional, mas necessário para os workflows funcionarem)

- [x] Criar um repositório no GitHub e fazer push — feito em 2026-07-12:
      `https://github.com/TiadoDaCriador/Portf-io`, branch `master` a
      seguir `origin/master`.
- [ ] Confirmar que ativaste Settings → Pages → Build and deployment →
      Source: "GitHub Actions" nesse repositório (passo manual, só no site
      do GitHub — sem isto o `pages.yml` fica sem efeito mesmo com o push
      feito).
- [ ] Se quiseres o deploy automático do Firebase a cada push: gerar o secret
      `FIREBASE_SERVICE_ACCOUNT` com `firebase init hosting:github` (faz isto
      uma vez) e confirmar que o `projectId` em `.github/workflows/deploy.yml`
      está certo.
- [ ] Se preferires (ou quiseres em paralelo) o GitHub Pages: Settings → Pages
      → Build and deployment → Source: "GitHub Actions" (`pages.yml` já está
      pronto, não precisa de secrets).

## 3. Domínio nos metadados

- [ ] Trocar `https://tiagosilva.dev` pelo domínio real que vieres a usar
      (`https://<id-do-projeto>.web.app`, `https://<utilizador>.github.io/...`,
      ou um domínio próprio) em três sítios:
  - `html-css-js/index.html` (`canonical`, `og:url`, `og:image`)
  - `html-css-js/robots.txt`
  - `html-css-js/sitemap.xml`

## 4. Conteúdo — obrigatório antes de partilhar com recrutadores

- [x] Substituir os três projetos placeholder (FitTrack, MesaFácil, StudyFlow)
      por projetos reais — feito: App Sócios e Maestro Member (estágio na
      MUsa Software), com métricas técnicas reais (574 testes, 6 ecrãs) em
      vez de percentagens inventadas.
- [ ] Os cards já não têm botões de Repositório/Demo/Vídeo (removidos a teu
      pedido em 2026-07-12). Se um dia quiseres mostrá-los: tornar públicos
      os repositórios reais (`github.com/TiadoDaCriador/Socios_App` e
      `/Maestro_Member` — atualmente 404 publicamente) e voltar a adicionar
      os links aos cards.
- [x] Email e GitHub — feito em 2026-07-12: `tiago-silva198@hotmail.com`
      e `github.com/TiadoDaCriador`.
- [ ] LinkedIn ainda é placeholder (`linkedin.com/in/tiago-silva-dev`) —
      substitui em `html-css-js/index.html` quando tiveres o perfil real.

Nota: a pasta `ionic-angular/` foi removida (2026-07-10) — o portefólio é só
`html-css-js/` agora.

## 5. Checklist manual de QA antes de publicar

- [ ] Menu mobile (abrir/fechar, fecha ao clicar num link).
- [ ] Carrossel de projetos: arrasto com rato, setas visíveis, navegação por
      teclado (Tab + ← →).
- [ ] Banner de consentimento: testar aceitar e recusar.
- [ ] `prefers-reduced-motion` ativo no SO — confirmar que os reveals ficam
      estáticos mas legíveis.
- [ ] Correr um relatório Lighthouse no Chrome (alvo ≥ 95 nas quatro
      categorias) no site já publicado (não no localhost).
