import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

const EQUIPMENT_BY_PLACE = {
  academia: ['barra', 'halteres', 'maquina', 'cabo', 'peso_corporal', 'cardio_equip'],
  casa: ['halteres', 'peso_corporal', 'elastico'],
  peso_corporal: ['peso_corporal'],
};

const SET_REP_BY_GOAL = {
  forca: { sets: 4, repsMin: 4, repsMax: 6 },
  hipertrofia: { sets: 3, repsMin: 8, repsMax: 12 },
  resistencia: { sets: 3, repsMin: 15, repsMax: 20 },
  emagrecimento: { sets: 3, repsMin: 12, repsMax: 15 },
};

// Split superior/inferior. O superior inclui costas (maior músculo do tronco)
// e antebraço como acessório. O glúteo é treinado dentro de posterior.
const LOWER_GROUPS = ['quadriceps', 'posterior', 'panturrilha', 'core'];

// A ênfase muda como o superior é organizado e rotaciona entre blocos:
// - antagonista: pares opostos (peito↔costas, bíceps↔tríceps) — bom p/ superséries
// - push_pull: empurrar (peito/ombro/tríceps) depois puxar (costas/bíceps)
const UPPER_GROUPS_BY_EMPHASIS = {
  antagonista: ['peito', 'costas', 'biceps', 'triceps', 'ombro', 'antebraco'],
  push_pull: ['peito', 'ombro', 'triceps', 'costas', 'biceps', 'antebraco'],
};

// Prioridade de alocação quando o tempo é curto (músculos maiores primeiro).
// Antebraço/core/panturrilha são os primeiros a sair de um treino apertado.
const GROUP_PRIORITY = {
  peito: 6,
  costas: 6,
  quadriceps: 6,
  posterior: 5,
  ombro: 5,
  biceps: 4,
  triceps: 4,
  panturrilha: 2,
  core: 2,
  antebraco: 1,
};

// Orçamento de exercícios por tempo disponível (inclui aquecimento). Cada
// exercício leva ~8 min entre séries e descanso na média de hipertrofia.
const EXERCISE_BUDGET_BY_TIME = {
  30: 4,
  45: 6,
  60: 8,
  90: 11,
};

function nearestKey(map, value) {
  const keys = Object.keys(map).map(Number);
  return keys.reduce((closest, k) =>
    Math.abs(k - value) < Math.abs(closest - value) ? k : closest
  );
}

// Sequência de dias no microciclo: alterna superior/inferior começando pelo
// superior. Ex.: 3 dias => Sup / Inf / Sup (repete igual na semana seguinte).
function daySequence(days) {
  const seq = [];
  for (let i = 0; i < days; i += 1) {
    seq.push(i % 2 === 0 ? 'superior' : 'inferior');
  }
  return seq;
}

// Decide quantos exercícios cada grupo recebe, respeitando o orçamento total.
// Distribui 1 por grupo (por prioridade) e depois reforça os maiores até o teto.
function allocateCounts(groups, budget, maxPerGroup) {
  const counts = {};
  groups.forEach((g) => {
    counts[g] = 0;
  });
  const byPriority = [...groups].sort(
    (a, b) => (GROUP_PRIORITY[b] ?? 0) - (GROUP_PRIORITY[a] ?? 0)
  );

  let remaining = budget;
  for (const g of byPriority) {
    if (remaining <= 0) break;
    counts[g] = 1;
    remaining -= 1;
  }

  let added = true;
  while (remaining > 0 && added) {
    added = false;
    for (const g of byPriority) {
      if (remaining <= 0) break;
      if (counts[g] > 0 && counts[g] < maxPerGroup) {
        counts[g] += 1;
        remaining -= 1;
        added = true;
      }
    }
  }
  return counts;
}

function pickExercisesForGroup(group, allowedEquipment, offset, count) {
  const options = EXERCISE_LIBRARY.filter(
    (ex) => ex.muscleGroup === group && allowedEquipment.includes(ex.equipment)
  );
  if (options.length === 0 || count <= 0) return [];
  const start = offset % options.length;
  const rotated = [...options.slice(start), ...options.slice(0, start)];
  return rotated.slice(0, count);
}

export function generateWorkoutPlan({
  goalKey,
  daysPerWeek,
  placeKey,
  levelKey,
  timeKey = 60,
  emphasis = 'antagonista',
  blockMonths = 1,
}) {
  const allowedEquipment = EQUIPMENT_BY_PLACE[placeKey] ?? EQUIPMENT_BY_PLACE.academia;
  const setRep = SET_REP_BY_GOAL[goalKey] ?? SET_REP_BY_GOAL.hipertrofia;
  const upperGroups = UPPER_GROUPS_BY_EMPHASIS[emphasis] ?? UPPER_GROUPS_BY_EMPHASIS.antagonista;
  const maxPerGroup = levelKey === 'avancado' ? 3 : 2;

  const budgetTime = nearestKey(EXERCISE_BUDGET_BY_TIME, timeKey);
  let budget = EXERCISE_BUDGET_BY_TIME[budgetTime];
  if (levelKey === 'iniciante') budget = Math.max(3, budget - 1);
  else if (levelKey === 'avancado') budget += 1;

  const sequence = daySequence(daysPerWeek);
  const typeCounter = { superior: 0, inferior: 0 };

  const templates = sequence.map((dayType, dayIndex) => {
    const groups = dayType === 'superior' ? upperGroups : LOWER_GROUPS;
    const counts = allocateCounts(groups, budget, maxPerGroup);

    const exerciseEntries = [];
    groups.forEach((group) => {
      const picked = pickExercisesForGroup(group, allowedEquipment, dayIndex, counts[group]);
      picked.forEach((exercise) => {
        exerciseEntries.push({
          exerciseId: exercise.id,
          targetSets: setRep.sets,
          targetRepsMin: setRep.repsMin,
          targetRepsMax: setRep.repsMax,
        });
      });
    });

    if (goalKey === 'emagrecimento') {
      const cardioOptions = EXERCISE_LIBRARY.filter(
        (ex) => ex.muscleGroup === 'cardio' && allowedEquipment.includes(ex.equipment)
      );
      const cardio = cardioOptions[dayIndex % cardioOptions.length] ?? cardioOptions[0];
      if (cardio) {
        exerciseEntries.push({
          exerciseId: cardio.id,
          targetDurationMin: 25,
        });
      }
    }

    typeCounter[dayType] += 1;
    const letter = String.fromCharCode(64 + typeCounter[dayType]); // A, B, C...
    const baseName = dayType === 'superior' ? 'Superior' : 'Inferior';

    return {
      name: `${baseName} ${letter}`,
      dayType,
      emphasis,
      blockMonths,
      exerciseEntries,
    };
  });

  return templates;
}

// Alterna a ênfase entre um bloco e o próximo (o "depois ao contrário").
export function nextEmphasis(emphasis) {
  return emphasis === 'antagonista' ? 'push_pull' : 'antagonista';
}

export const GENERATOR_GOALS = [
  { key: 'hipertrofia', label: 'Hipertrofia' },
  { key: 'forca', label: 'Força' },
  { key: 'resistencia', label: 'Resistência' },
  { key: 'emagrecimento', label: 'Emagrecimento' },
];

export const GENERATOR_PLACES = [
  { key: 'academia', label: 'Academia completa' },
  { key: 'casa', label: 'Casa (pouco equipamento)' },
  { key: 'peso_corporal', label: 'Só peso do corpo' },
];

export const GENERATOR_LEVELS = [
  { key: 'iniciante', label: 'Iniciante' },
  { key: 'intermediario', label: 'Intermediário' },
  { key: 'avancado', label: 'Avançado' },
];

export const GENERATOR_TIMES = [
  { key: 30, label: '30 min' },
  { key: 45, label: '45 min' },
  { key: 60, label: '1 hora' },
  { key: 90, label: '1h30' },
];

export const GENERATOR_BLOCKS = [
  { key: 1, label: '1 mês' },
  { key: 2, label: '2 meses' },
  { key: 3, label: '3 meses' },
];

export const GENERATOR_EMPHASES = [
  { key: 'antagonista', label: 'Antagonistas' },
  { key: 'push_pull', label: 'Push / Pull' },
];
