// Passo a passo de execução dos exercícios da biblioteca. Chave = id do exercício.
// Texto curto e seguro; para ver em movimento, o app abre um vídeo de demonstração.
export const EXERCISE_INSTRUCTIONS = {
  // ----- Peito -----
  'lib-supino-reto-barra': {
    steps: [
      'Deite no banco com os pés firmes no chão e segure a barra um pouco mais aberto que os ombros.',
      'Desça a barra controlando até a linha do meio do peito.',
      'Empurre de volta até quase estender os cotovelos, sem travá-los.',
    ],
    tip: 'Mantenha as escápulas retraídas (peito aberto) durante todo o movimento.',
  },
  'lib-supino-inclinado-halteres': {
    steps: [
      'No banco inclinado (30–45°), segure um halter em cada mão na linha do peito.',
      'Empurre os halteres para cima até quase se tocarem.',
      'Desça controlando até sentir o peito alongar.',
    ],
  },
  'lib-crucifixo': {
    steps: [
      'Deitado, halteres acima do peito com os cotovelos levemente flexionados.',
      'Abra os braços em arco até a altura do peito.',
      'Volte fazendo o movimento de "abraçar", apertando o peito.',
    ],
    tip: 'Não desça demais os cotovelos para proteger o ombro.',
  },
  'lib-crossover': {
    steps: [
      'Em pé no meio da polia alta, segure as alças com os braços abertos e tronco levemente à frente.',
      'Puxe as alças para a frente do corpo, cruzando levemente as mãos.',
      'Volte controlando, sem deixar os pesos baterem.',
    ],
  },
  'lib-flexao': {
    steps: [
      'Mãos no chão pouco mais abertas que os ombros, corpo reto da cabeça aos pés.',
      'Desça o peito até perto do chão dobrando os cotovelos.',
      'Empurre de volta mantendo o abdômen firme.',
    ],
  },

  // ----- Costas -----
  'lib-puxada-frontal': {
    steps: [
      'Sentado na polia alta, segure a barra mais aberto que os ombros.',
      'Puxe a barra até a parte alta do peito, levando os cotovelos para baixo.',
      'Suba controlando até estender os braços.',
    ],
    tip: 'Evite jogar o tronco para trás; puxe com as costas, não com o impulso.',
  },
  'lib-remada-curvada': {
    steps: [
      'Em pé, tronco inclinado ~45°, joelhos semiflexionados, segure a barra.',
      'Puxe a barra em direção ao abdômen, apertando as costas.',
      'Desça controlando.',
    ],
    tip: 'Mantenha a coluna neutra, sem arredondar as costas.',
  },
  'lib-remada-baixa': {
    steps: [
      'Sentado na polia baixa, segure o triângulo com os braços estendidos e coluna ereta.',
      'Puxe em direção ao abdômen, abrindo o peito.',
      'Volte controlando até estender os braços.',
    ],
  },
  'lib-remada-unilateral': {
    steps: [
      'Apoie um joelho e uma mão no banco; segure o halter com o outro braço estendido.',
      'Puxe o halter até a lateral do tronco, cotovelo junto ao corpo.',
      'Desça controlando.',
    ],
  },
  'lib-barra-fixa': {
    steps: [
      'Segure a barra com pegada mais aberta que os ombros.',
      'Puxe o corpo até o queixo passar a barra.',
      'Desça controlando até estender os braços.',
    ],
    tip: 'Se ainda não consegue, use elástico de auxílio ou a máquina assistida.',
  },
  'lib-pulldown': {
    steps: [
      'Na polia alta, segure a barra e mantenha o tronco firme.',
      'Puxe a barra até o peito, levando os cotovelos para baixo e para trás.',
      'Suba controlando.',
    ],
  },

  // ----- Ombro -----
  'lib-desenvolvimento': {
    steps: [
      'Sentado ou em pé, segure a barra na altura dos ombros, pegada pouco mais aberta que eles.',
      'Empurre a barra para cima até quase estender os cotovelos.',
      'Desça controlando até a altura do queixo.',
    ],
    tip: 'Não arqueie demais a lombar; mantenha o abdômen firme.',
  },
  'lib-elevacao-lateral': {
    steps: [
      'Em pé, um halter em cada mão ao lado do corpo, cotovelos levemente flexionados.',
      'Eleve os braços até a altura dos ombros, em forma de "T".',
      'Desça controlando.',
    ],
    tip: 'Suba os cotovelos, não as mãos; evite usar impulso.',
  },
  'lib-elevacao-frontal': {
    steps: [
      'Em pé, halteres à frente das coxas.',
      'Eleve um ou os dois braços à frente até a altura dos ombros.',
      'Desça controlando.',
    ],
  },
  'lib-remada-alta': {
    steps: [
      'Em pé, segure a barra com pegada fechada à frente das coxas.',
      'Puxe a barra em direção ao queixo, cotovelos apontando para cima.',
      'Desça controlando.',
    ],
  },
  'lib-crucifixo-inverso': {
    steps: [
      'Tronco inclinado à frente, halteres abaixo do peito com cotovelos leves.',
      'Abra os braços para os lados apertando a parte de trás dos ombros.',
      'Volte controlando.',
    ],
  },

  // ----- Bíceps -----
  'lib-rosca-direta': {
    steps: [
      'Em pé, segure a barra com as palmas para cima, braços estendidos.',
      'Flexione os cotovelos levando a barra até perto dos ombros.',
      'Desça controlando até estender.',
    ],
    tip: 'Mantenha os cotovelos parados ao lado do corpo.',
  },
  'lib-rosca-alternada': {
    steps: [
      'Em pé, um halter em cada mão, palmas para dentro.',
      'Flexione um braço girando a palma para cima ao subir.',
      'Desça e alterne os braços.',
    ],
  },
  'lib-rosca-martelo': {
    steps: [
      'Em pé, halteres com as palmas viradas para dentro (pegada neutra).',
      'Flexione os cotovelos mantendo a pegada neutra.',
      'Desça controlando.',
    ],
  },
  'lib-rosca-scott': {
    steps: [
      'Apoie a parte de trás dos braços no banco Scott, segure a barra/halter.',
      'Flexione os cotovelos subindo o peso.',
      'Desça controlando sem estender totalmente de forma brusca.',
    ],
  },
  'lib-rosca-cabo': {
    steps: [
      'Na polia baixa, segure a barra/corda com as palmas para cima.',
      'Flexione os cotovelos levando o peso aos ombros.',
      'Desça controlando.',
    ],
  },

  // ----- Tríceps -----
  'lib-triceps-pulley': {
    steps: [
      'Na polia alta com a corda, cotovelos junto ao corpo.',
      'Estenda os cotovelos empurrando a corda para baixo, abrindo as pontas no fim.',
      'Volte controlando até ~90°.',
    ],
    tip: 'Mantenha os cotovelos parados; só o antebraço se move.',
  },
  'lib-triceps-testa': {
    steps: [
      'Deitado, segure a barra acima da testa com os braços estendidos.',
      'Dobre os cotovelos descendo a barra em direção à testa.',
      'Estenda de volta.',
    ],
  },
  'lib-triceps-frances': {
    steps: [
      'Sentado, segure um halter com as duas mãos acima da cabeça.',
      'Desça o halter atrás da cabeça dobrando os cotovelos.',
      'Estenda de volta para cima.',
    ],
  },
  'lib-mergulho-banco': {
    steps: [
      'Mãos apoiadas na borda de um banco atrás do corpo, pernas à frente.',
      'Desça o corpo dobrando os cotovelos até ~90°.',
      'Empurre de volta.',
    ],
  },
  'lib-triceps-coice': {
    steps: [
      'Tronco inclinado, cotovelo junto ao corpo formando ~90°.',
      'Estenda o cotovelo levando o halter para trás.',
      'Volte controlando.',
    ],
  },

  // ----- Antebraço -----
  'lib-rosca-punho-barra': {
    steps: [
      'Sentado, antebraços apoiados nas coxas, palmas para cima segurando a barra.',
      'Suba a barra flexionando só os punhos.',
      'Desça controlando.',
    ],
  },
  'lib-rosca-inversa': {
    steps: [
      'Em pé, segure a barra com as palmas para baixo.',
      'Flexione os cotovelos subindo a barra.',
      'Desça controlando.',
    ],
  },
  'lib-rosca-punho-halteres': {
    steps: [
      'Antebraços apoiados, palmas para cima com um halter em cada mão.',
      'Suba flexionando só os punhos.',
      'Desça controlando.',
    ],
  },
  'lib-rosca-punho-cabo': {
    steps: [
      'Na polia baixa, palmas para cima, antebraços apoiados.',
      'Flexione os punhos subindo o peso.',
      'Desça controlando.',
    ],
  },
  'lib-farmer-walk': {
    steps: [
      'Segure um peso pesado em cada mão ao lado do corpo.',
      'Caminhe com postura ereta e passos firmes pela distância/tempo.',
      'Mantenha ombros para trás e abdômen firme.',
    ],
  },

  // ----- Quadríceps -----
  'lib-agachamento-livre': {
    steps: [
      'Barra apoiada nos trapézios, pés na largura dos ombros.',
      'Agache empurrando o quadril para trás até as coxas ficarem paralelas ao chão.',
      'Suba empurrando o chão com os pés.',
    ],
    tip: 'Joelhos alinhados com os pés; coluna neutra.',
  },
  'lib-leg-press': {
    steps: [
      'Sentado na máquina, pés na plataforma na largura dos ombros.',
      'Desça dobrando os joelhos até ~90°.',
      'Empurre de volta sem travar os joelhos.',
    ],
  },
  'lib-cadeira-extensora': {
    steps: [
      'Sentado, tornozelos atrás do rolo.',
      'Estenda os joelhos elevando o peso.',
      'Desça controlando.',
    ],
  },
  'lib-afundo': {
    steps: [
      'Em pé com halteres, dê um passo à frente.',
      'Desça dobrando os dois joelhos até o de trás quase tocar o chão.',
      'Volte empurrando com a perna da frente e alterne.',
    ],
  },
  'lib-agachamento-bulgaro': {
    steps: [
      'Fique de costas para um banco e apoie o peito do pé de trás nele.',
      'Com a perna da frente, agache até a coxa ficar paralela ao chão.',
      'Suba empurrando o chão com o calcanhar da frente.',
    ],
    tip: 'O joelho da frente segue a direção do pé; tronco levemente à frente.',
  },

  // ----- Posterior / Glúteo -----
  'lib-stiff': {
    steps: [
      'Em pé, barra/halteres à frente das coxas, joelhos levemente flexionados.',
      'Desça o peso rente às pernas empurrando o quadril para trás.',
      'Suba contraindo glúteos e posterior.',
    ],
    tip: 'Costas retas; sinta o alongamento na parte de trás da coxa.',
  },
  'lib-mesa-flexora': {
    steps: [
      'Deitado na máquina, tornozelos atrás do rolo.',
      'Flexione os joelhos trazendo os calcanhares aos glúteos.',
      'Desça controlando.',
    ],
  },
  'lib-elevacao-pelvica': {
    steps: [
      'Costas apoiadas num banco, barra sobre o quadril, pés no chão.',
      'Eleve o quadril até o tronco ficar alinhado com as coxas, apertando o glúteo.',
      'Desça controlando.',
    ],
  },
  'lib-cadeira-flexora': {
    steps: [
      'Sentado, pernas sobre o rolo.',
      'Flexione os joelhos empurrando o rolo para baixo.',
      'Volte controlando.',
    ],
  },
  'lib-glute-bridge': {
    steps: [
      'Deitado de costas, joelhos dobrados e pés no chão.',
      'Eleve o quadril apertando os glúteos.',
      'Desça controlando.',
    ],
  },

  // ----- Panturrilha -----
  'lib-panturrilha-pe': {
    steps: [
      'Em pé na máquina/step, ponta dos pés apoiada.',
      'Suba na ponta dos pés o máximo possível.',
      'Desça controlando, alongando a panturrilha embaixo.',
    ],
  },
  'lib-panturrilha-sentado': {
    steps: [
      'Sentado, joelhos sob o apoio, ponta dos pés na plataforma.',
      'Eleve os calcanhares o máximo possível.',
      'Desça controlando.',
    ],
  },

  // ----- Core / Abdômen -----
  'lib-abdominal-supra': {
    steps: [
      'Deitado, joelhos dobrados, mãos na nuca sem puxar o pescoço.',
      'Eleve o tronco contraindo o abdômen.',
      'Desça controlando.',
    ],
  },
  'lib-prancha': {
    steps: [
      'Apoie antebraços e pontas dos pés, corpo reto.',
      'Contraia abdômen e glúteos e segure a posição pelo tempo alvo.',
      'Evite deixar o quadril cair ou subir demais.',
    ],
  },
  'lib-elevacao-pernas': {
    steps: [
      'Deitado ou pendurado, pernas estendidas.',
      'Eleve as pernas contraindo a parte baixa do abdômen.',
      'Desça controlando sem balançar.',
    ],
  },
  'lib-abdominal-polia': {
    steps: [
      'Ajoelhado na polia alta, segure a corda perto da cabeça.',
      'Flexione o tronco em direção ao chão contraindo o abdômen.',
      'Volte controlando.',
    ],
  },
  'lib-abdominal-obliquo': {
    steps: [
      'Deitado, joelhos dobrados.',
      'Eleve o tronco girando o cotovelo em direção ao joelho oposto.',
      'Alterne os lados.',
    ],
  },

  // ----- Cardio -----
  'lib-esteira-corrida': {
    steps: [
      'Ajuste velocidade e inclinação confortáveis para correr.',
      'Mantenha postura ereta e passada natural.',
      'Segure o ritmo pelo tempo alvo.',
    ],
  },
  'lib-esteira-caminhada': {
    steps: [
      'Caminhe em ritmo firme, podendo usar inclinação.',
      'Postura ereta, braços acompanhando o movimento.',
      'Mantenha pelo tempo alvo.',
    ],
  },
  'lib-bicicleta-ergometrica': {
    steps: [
      'Ajuste o banco na altura em que a perna quase estende embaixo.',
      'Pedale em ritmo constante e resistência confortável.',
      'Mantenha pelo tempo alvo.',
    ],
  },
  'lib-eliptico': {
    steps: [
      'Segure as alças e pedale com passada fluida.',
      'Mantenha o tronco ereto.',
      'Segure o ritmo pelo tempo alvo.',
    ],
  },
  'lib-remo-ergometro': {
    steps: [
      'Impulsione com as pernas, depois puxe a alça ao tronco.',
      'Volte estendendo os braços e dobrando as pernas.',
      'Mantenha o ritmo pelo tempo alvo.',
    ],
  },
  'lib-pular-corda': {
    steps: [
      'Gire a corda com os punhos e salte com os dois pés.',
      'Mantenha saltos baixos e ritmo constante.',
      'Siga pelo tempo alvo.',
    ],
  },
  'lib-corrida-rua': {
    steps: [
      'Aqueça com uma caminhada leve.',
      'Corra em ritmo que consiga manter, postura ereta.',
      'Siga pelo tempo alvo.',
    ],
  },
  'lib-hiit': {
    steps: [
      'Alterne períodos curtos de esforço máximo com descanso ativo.',
      'Ex.: 30s forte / 30s leve, repetindo.',
      'Siga pelo tempo alvo.',
    ],
  },
};

export function getExerciseInstructions(id) {
  return EXERCISE_INSTRUCTIONS[id] ?? null;
}
