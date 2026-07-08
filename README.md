# Portfólio — Tiago Silva

Portfólio de uma página, em português de Portugal, para candidaturas a estágio,
freelance ou primeira oportunidade em desenvolvimento mobile/web.

Há duas versões, com o mesmo conteúdo e o mesmo sistema visual:

```
portfolio-tiago-silva/
├── html-css-js/          → versão estática, pronta a publicar já
│   ├── index.html
│   ├── css/styles.css
│   └── js/script.js
└── ionic-angular/         → versão em componentes Angular standalone
    └── src/
        ├── main.ts
        ├── global.scss
        ├── theme/variables.scss
        └── app/
            ├── app.component.ts / .html / .scss
            ├── models/
            │   ├── project.model.ts
            │   └── skill-group.model.ts
            ├── data/
            │   └── portfolio-data.ts      → projetos e competências, num único sítio
            └── components/
                ├── header/
                ├── hero/
                ├── about/
                ├── projects/
                ├── project-card/
                ├── skills/
                ├── contact/
                └── footer/
```

## 1. Qual usar

**html-css-js/** — não precisa de build nem de instalar nada. Basta abrir o
`index.html` num browser, ou arrastar a pasta para um serviço como Netlify,
Vercel ou GitHub Pages. É a forma mais rápida de teres o portfólio online
ainda hoje.

**ionic-angular/** — para quem já tem (ou vai ter) um projeto Ionic Angular
a correr, e prefere manter o portfólio como parte desse ecossistema, com
componentes reutilizáveis. Os ficheiros estão organizados como iriam ficar
dentro de `src/app/` de um projeto gerado com `ionic start`. Para usar:

1. Cria um projeto novo: `ionic start portfolio blank --type=angular`
2. Substitui o conteúdo de `src/app/`, `src/theme/`, `src/global.scss` e
   `src/main.ts` pelos ficheiros desta pasta.
3. `npm install` e depois `ionic serve`.

## 2. Como publicar (versão HTML/CSS/JS)

Opções simples e gratuitas:

- **Netlify / Vercel** — arrasta a pasta `html-css-js` para o site deles, ou
  liga a um repositório GitHub para deploy automático a cada alteração.
- **GitHub Pages** — cria um repositório, faz push do conteúdo de
  `html-css-js`, e ativa Pages nas definições do repositório.

## 3. Antes de publicar — o que tens mesmo de mudar

- **Projetos**: os três projetos (FitTrack, MesaFácil, StudyFlow) são
  exemplos escritos para preencher o template com uma estrutura credível
  (problema → solução → resultado). Substitui pelos teus projetos reais.
  Se ainda não tens três projetos completos, é preferível mostrar dois
  projetos verdadeiros do que três inventados — os números de resultado
  (32%, 40%, 78%) têm de ser reais ou removidos, nunca inventados numa
  candidatura real.
- **Contactos**: o email, LinkedIn e GitHub no fim de cada versão são
  placeholders. Substitui em `index.html` (procura por `tiago.silva.dev`,
  `tiago-silva-dev` e `tiagosilva-dev`) e em
  `ionic-angular/src/app/components/contact/contact.component.ts`.
- **Links dos projetos**: os botões "Ver repositório" apontam para `#`.
  Substitui pelo link real do GitHub ou de uma demo, em ambas as versões
  (`index.html` e `portfolio-data.ts`).

## 4. Sugestões para melhorares depois

- Adicionar uma secção de **certificações ou formação** se tiveres cursos,
  bootcamps ou certificações relevantes (ex: Google Analytics, Firebase).
- Ligar um **domínio próprio** (ex: tiagosilva.dev) em vez do subdomínio
  gratuito do Netlify/Vercel — reforça a perceção profissional.
- Adicionar **capturas de ecrã ou GIFs curtos** dos projetos nos cards,
  assim que tiveres versões funcionais para mostrar.
- Criar uma versão em **inglês** do mesmo site (útil se te candidatares a
  empresas internacionais ou remotas).
- Adicionar **Google Analytics ou Plausible** ao próprio portfólio — é uma
  boa forma de mostrares, na prática, que sabes medir uso real (e de teres
  dados concretos sobre quem visita o site).
- Considerar um **CV em PDF** para download a partir do botão "Contactar"
  ou da secção de contacto.
- Validar acessibilidade e performance com o **Lighthouse** do Chrome antes
  de publicar a versão final.

## 5. Notas técnicas

- Tipografia (`html-css-js`): Bebas Neue nos títulos + Inter no corpo de
  texto (Google Fonts).
- Sem frameworks CSS externos — CSS puro com custom properties (`:root` em
  `css/styles.css`), para manter o site leve e rápido.
- Cores, espaçamentos e sombras estão centralizados em tokens (`:root` no
  CSS / `variables.scss` no Ionic) — nota: as duas versões usam paletas
  diferentes de momento (`html-css-js` tem o tema navy/cream do redesign
  mais recente; `ionic-angular` ainda tem a paleta indigo/slate original).
- O menu mobile (dropdown), o drag-to-scroll do carrossel de projetos e o
  ano automático no rodapé estão implementados em JavaScript puro
  (`js/script.js`), sem dependências.
