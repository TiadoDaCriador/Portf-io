import { Project } from '../models/project.model';
import { SkillGroup } from '../models/skill-group.model';

/**
 * Fonte única de conteúdo para as secções de Projetos e Competências.
 * Mantém os componentes "burros" (apresentação) e o conteúdo fácil de editar
 * num único sítio.
 *
 * IMPORTANTE: os projetos abaixo são exemplos ilustrativos para preencher o
 * template. Substitui por projetos reais (e resultados verdadeiros) antes de
 * publicar o site.
 */

export const PROJECTS: Project[] = [
  {
    title: 'FitTrack',
    category: 'App mobile',
    description:
      'App de acompanhamento de treinos para quem treina sozinho e perde a consistência ' +
      'por falta de visibilidade sobre o próprio progresso. Sincroniza dados entre ' +
      'dispositivos e usa eventos de analytics para perceber em que ponto os utilizadores ' +
      'desistem de um plano.',
    result:
      'Em teste com 25 utilizadores beta, a introdução de um sistema de streaks ' +
      '(baseado em eventos do Analytics) aumentou a conclusão de treinos semanais em 32%.',
    tags: ['Ionic Angular', 'Capacitor', 'Firebase Auth', 'Firestore', 'Google Analytics'],
    repoUrl: '#',
  },
  {
    title: 'MesaFácil',
    category: 'Web app',
    description:
      'Sistema de reservas para restaurantes pequenos que ainda gerem mesas por telefone ' +
      'ou WhatsApp. Painel de administração com estado das mesas em tempo real e métricas ' +
      'de ocupação por dia e por hora.',
    result:
      'Num piloto com um restaurante local, o tempo diário gasto pela equipa a gerir ' +
      'reservas manualmente reduziu cerca de 40%.',
    tags: ['Angular', 'TypeScript', 'Firestore (realtime)', 'Firebase Hosting', 'Google Analytics'],
    repoUrl: '#',
  },
  {
    title: 'StudyFlow',
    category: 'App mobile',
    description:
      'Plataforma de organização de estudos para estudantes com várias cadeiras e prazos ' +
      'em simultâneo. Sincronização entre telemóvel e tablet, e um dashboard de hábitos de ' +
      'estudo construído a partir de eventos reais de utilização.',
    result:
      'Usado por um grupo de 40 colegas de curso durante um semestre; 78% reportou melhor ' +
      'gestão do tempo de estudo em inquérito informal realizado no final do período.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Google Analytics'],
    repoUrl: '#',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  { title: 'Mobile', skills: ['Ionic Angular', 'Flutter', 'Capacitor'] },
  { title: 'Web', skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML5 / CSS3'] },
  { title: 'Backend & Dados', skills: ['Firebase', 'Firestore', 'Firebase Auth'] },
  { title: 'Analytics', skills: ['Google Analytics', 'Firebase Analytics', 'Definição de eventos e métricas'] },
];
