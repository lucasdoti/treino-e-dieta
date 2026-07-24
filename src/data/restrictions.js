// Restrições/adaptações do gerador. IMPORTANTE: são precauções gerais para
// reduzir risco (remover movimentos mais arriscados e aliviar a intensidade),
// NÃO substituem avaliação médica ou de um profissional de educação física.

export const RESTRICTIONS = [
  { key: 'joelho', label: 'Joelho sensível' },
  { key: 'coluna', label: 'Coluna / lombar' },
  { key: 'ombro', label: 'Ombro sensível' },
  { key: 'sem_impacto', label: 'Sem impacto' },
  { key: 'gestante', label: 'Gestante' },
  { key: 'maquinas', label: 'Preferir máquinas' },
];

// Exercícios removidos por restrição (mais conservador quando há dúvida).
const EXCLUDED_BY_RESTRICTION = {
  joelho: [
    'lib-agachamento-livre', 'lib-afundo', 'lib-agachamento-bulgaro',
    'lib-pular-corda', 'lib-corrida-rua', 'lib-esteira-corrida', 'lib-hiit', 'lib-fitdance',
  ],
  coluna: [
    'lib-agachamento-livre', 'lib-stiff', 'lib-remada-curvada', 'lib-remada-alta',
    'lib-desenvolvimento', 'lib-farmer-walk', 'lib-elevacao-pernas',
  ],
  ombro: ['lib-desenvolvimento', 'lib-remada-alta', 'lib-barra-fixa'],
  sem_impacto: [
    'lib-pular-corda', 'lib-corrida-rua', 'lib-esteira-corrida', 'lib-hiit', 'lib-fitdance',
  ],
  gestante: [
    // Deitar de costas (supino/crucifixo/testa) — evitar após o 1º trimestre
    'lib-supino-reto-barra', 'lib-crucifixo', 'lib-triceps-testa',
    // Abdominais/core que pressionam a barriga
    'lib-abdominal-supra', 'lib-abdominal-obliquo', 'lib-elevacao-pernas',
    'lib-abdominal-polia', 'lib-prancha',
    // Carga axial pesada / equilíbrio
    'lib-agachamento-livre', 'lib-stiff', 'lib-remada-curvada', 'lib-desenvolvimento',
    'lib-afundo', 'lib-agachamento-bulgaro', 'lib-farmer-walk',
    // Impacto
    'lib-pular-corda', 'lib-corrida-rua', 'lib-esteira-corrida', 'lib-hiit', 'lib-fitdance',
  ],
};

export function isExerciseAllowed(exercise, keys) {
  if (!keys || keys.length === 0) return true;
  for (const k of keys) {
    if (EXCLUDED_BY_RESTRICTION[k]?.includes(exercise.id)) return false;
    // "Preferir máquinas": evita as barras livres (mais técnicas), favorece
    // máquinas, cabos e halteres.
    if (k === 'maquinas' && exercise.equipment === 'barra') return false;
  }
  return true;
}

// Gestante: treino de fortalecimento leve (menos séries, mais repetições).
export function adjustSetRep(setRep, keys) {
  if (keys?.includes('gestante')) {
    return { sets: Math.min(setRep.sets, 2), repsMin: 12, repsMax: 15 };
  }
  return setRep;
}
