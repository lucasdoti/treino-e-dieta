// Biblioteca padrão de exercícios. Somente leitura — o usuário pode ocultar
// ou complementar com exercícios próprios (ver AppDataContext).

export const MUSCLE_GROUPS = [
  { key: 'peito', label: 'Peito' },
  { key: 'costas', label: 'Costas' },
  { key: 'ombro', label: 'Ombro' },
  { key: 'biceps', label: 'Bíceps' },
  { key: 'triceps', label: 'Tríceps' },
  { key: 'antebraco', label: 'Antebraço' },
  { key: 'quadriceps', label: 'Quadríceps' },
  { key: 'posterior', label: 'Posterior/Glúteo' },
  { key: 'panturrilha', label: 'Panturrilha' },
  { key: 'core', label: 'Core/Abdômen' },
  { key: 'cardio', label: 'Cardio' },
];

export const EQUIPMENT = [
  { key: 'barra', label: 'Barra' },
  { key: 'halteres', label: 'Halteres' },
  { key: 'maquina', label: 'Máquina' },
  { key: 'cabo', label: 'Cabo/Polia' },
  { key: 'peso_corporal', label: 'Peso corporal' },
  { key: 'elastico', label: 'Elástico' },
  { key: 'cardio_equip', label: 'Equipamento de cardio' },
];

export const EXERCISE_LIBRARY = [
  // Peito
  { id: 'lib-supino-reto-barra', name: 'Supino reto (barra)', muscleGroup: 'peito', equipment: 'barra', homeAlternative: 'Flexão de braço' },
  { id: 'lib-supino-inclinado-halteres', name: 'Supino inclinado (halteres)', muscleGroup: 'peito', equipment: 'halteres', homeAlternative: 'Flexão inclinada (pés elevados)' },
  { id: 'lib-crucifixo', name: 'Crucifixo', muscleGroup: 'peito', equipment: 'halteres' },
  { id: 'lib-crossover', name: 'Crossover (cabo)', muscleGroup: 'peito', equipment: 'cabo', homeAlternative: 'Flexão com pés elevados' },
  { id: 'lib-flexao', name: 'Flexão de braço', muscleGroup: 'peito', equipment: 'peso_corporal' },

  // Costas
  { id: 'lib-puxada-frontal', name: 'Puxada frontal (polia)', muscleGroup: 'costas', equipment: 'cabo', homeAlternative: 'Remada com elástico' },
  { id: 'lib-remada-curvada', name: 'Remada curvada (barra)', muscleGroup: 'costas', equipment: 'barra' },
  { id: 'lib-remada-baixa', name: 'Remada baixa (cabo)', muscleGroup: 'costas', equipment: 'cabo' },
  { id: 'lib-remada-unilateral', name: 'Remada unilateral (halter)', muscleGroup: 'costas', equipment: 'halteres' },
  { id: 'lib-barra-fixa', name: 'Barra fixa', muscleGroup: 'costas', equipment: 'peso_corporal' },
  { id: 'lib-pulldown', name: 'Pulldown', muscleGroup: 'costas', equipment: 'cabo' },

  // Ombro
  { id: 'lib-desenvolvimento', name: 'Desenvolvimento militar', muscleGroup: 'ombro', equipment: 'barra', homeAlternative: 'Desenvolvimento com halteres' },
  { id: 'lib-elevacao-lateral', name: 'Elevação lateral', muscleGroup: 'ombro', equipment: 'halteres', homeAlternative: 'Elevação lateral com elástico' },
  { id: 'lib-elevacao-frontal', name: 'Elevação frontal', muscleGroup: 'ombro', equipment: 'halteres' },
  { id: 'lib-remada-alta', name: 'Remada alta', muscleGroup: 'ombro', equipment: 'barra' },
  { id: 'lib-crucifixo-inverso', name: 'Crucifixo inverso', muscleGroup: 'ombro', equipment: 'halteres' },

  // Bíceps
  { id: 'lib-rosca-direta', name: 'Rosca direta (barra)', muscleGroup: 'biceps', equipment: 'barra' },
  { id: 'lib-rosca-alternada', name: 'Rosca alternada', muscleGroup: 'biceps', equipment: 'halteres' },
  { id: 'lib-rosca-martelo', name: 'Rosca martelo', muscleGroup: 'biceps', equipment: 'halteres' },
  { id: 'lib-rosca-scott', name: 'Rosca Scott', muscleGroup: 'biceps', equipment: 'maquina' },
  { id: 'lib-rosca-cabo', name: 'Rosca no cabo', muscleGroup: 'biceps', equipment: 'cabo' },

  // Tríceps
  { id: 'lib-triceps-pulley', name: 'Tríceps pulley (corda)', muscleGroup: 'triceps', equipment: 'cabo' },
  { id: 'lib-triceps-testa', name: 'Tríceps testa (barra)', muscleGroup: 'triceps', equipment: 'barra' },
  { id: 'lib-triceps-frances', name: 'Tríceps francês (halter)', muscleGroup: 'triceps', equipment: 'halteres' },
  { id: 'lib-mergulho-banco', name: 'Mergulho no banco', muscleGroup: 'triceps', equipment: 'peso_corporal' },
  { id: 'lib-triceps-coice', name: 'Tríceps coice (halter)', muscleGroup: 'triceps', equipment: 'halteres' },

  // Antebraço
  { id: 'lib-rosca-punho-barra', name: 'Rosca de punho (barra)', muscleGroup: 'antebraco', equipment: 'barra', homeAlternative: 'Rosca de punho com halteres' },
  { id: 'lib-rosca-inversa', name: 'Rosca inversa (barra)', muscleGroup: 'antebraco', equipment: 'barra', homeAlternative: 'Rosca inversa com halteres' },
  { id: 'lib-rosca-punho-halteres', name: 'Rosca de punho (halteres)', muscleGroup: 'antebraco', equipment: 'halteres' },
  { id: 'lib-rosca-punho-cabo', name: 'Rosca de punho na polia', muscleGroup: 'antebraco', equipment: 'cabo' },
  { id: 'lib-farmer-walk', name: 'Caminhada do fazendeiro', muscleGroup: 'antebraco', equipment: 'halteres', homeAlternative: 'Segurar peso e caminhar' },

  // Quadríceps
  { id: 'lib-agachamento-livre', name: 'Agachamento livre (barra)', muscleGroup: 'quadriceps', equipment: 'barra', homeAlternative: 'Agachamento livre (peso corporal)' },
  { id: 'lib-leg-press', name: 'Leg press', muscleGroup: 'quadriceps', equipment: 'maquina' },
  { id: 'lib-cadeira-extensora', name: 'Cadeira extensora', muscleGroup: 'quadriceps', equipment: 'maquina' },
  { id: 'lib-afundo', name: 'Afundo (halteres)', muscleGroup: 'quadriceps', equipment: 'halteres', homeAlternative: 'Afundo (peso corporal)' },
  { id: 'lib-agachamento-bulgaro', name: 'Agachamento búlgaro', muscleGroup: 'quadriceps', equipment: 'halteres' },

  // Posterior / Glúteo
  { id: 'lib-stiff', name: 'Stiff', muscleGroup: 'posterior', equipment: 'barra' },
  { id: 'lib-mesa-flexora', name: 'Mesa flexora', muscleGroup: 'posterior', equipment: 'maquina' },
  { id: 'lib-elevacao-pelvica', name: 'Elevação pélvica (hip thrust)', muscleGroup: 'posterior', equipment: 'barra' },
  { id: 'lib-cadeira-flexora', name: 'Cadeira flexora', muscleGroup: 'posterior', equipment: 'maquina' },
  { id: 'lib-glute-bridge', name: 'Ponte de glúteo', muscleGroup: 'posterior', equipment: 'peso_corporal' },

  // Panturrilha
  { id: 'lib-panturrilha-pe', name: 'Panturrilha em pé', muscleGroup: 'panturrilha', equipment: 'maquina' },
  { id: 'lib-panturrilha-sentado', name: 'Panturrilha sentado', muscleGroup: 'panturrilha', equipment: 'maquina' },

  // Core / Abdômen
  { id: 'lib-abdominal-supra', name: 'Abdominal supra', muscleGroup: 'core', equipment: 'peso_corporal' },
  { id: 'lib-prancha', name: 'Prancha', muscleGroup: 'core', equipment: 'peso_corporal' },
  { id: 'lib-elevacao-pernas', name: 'Elevação de pernas', muscleGroup: 'core', equipment: 'peso_corporal' },
  { id: 'lib-abdominal-polia', name: 'Abdominal na polia', muscleGroup: 'core', equipment: 'cabo' },
  { id: 'lib-abdominal-obliquo', name: 'Abdominal oblíquo', muscleGroup: 'core', equipment: 'peso_corporal' },

  // Cardio
  { id: 'lib-esteira-corrida', name: 'Corrida na esteira', muscleGroup: 'cardio', equipment: 'cardio_equip' },
  { id: 'lib-esteira-caminhada', name: 'Caminhada na esteira', muscleGroup: 'cardio', equipment: 'cardio_equip' },
  { id: 'lib-bicicleta-ergometrica', name: 'Bicicleta ergométrica', muscleGroup: 'cardio', equipment: 'cardio_equip' },
  { id: 'lib-eliptico', name: 'Elíptico', muscleGroup: 'cardio', equipment: 'cardio_equip' },
  { id: 'lib-remo-ergometro', name: 'Remo (ergômetro)', muscleGroup: 'cardio', equipment: 'cardio_equip' },
  { id: 'lib-pular-corda', name: 'Pular corda', muscleGroup: 'cardio', equipment: 'peso_corporal' },
  { id: 'lib-corrida-rua', name: 'Corrida na rua', muscleGroup: 'cardio', equipment: 'peso_corporal' },
  { id: 'lib-hiit', name: 'HIIT (circuito)', muscleGroup: 'cardio', equipment: 'peso_corporal' },
  { id: 'lib-fitdance', name: 'FitDance (dança)', muscleGroup: 'cardio', equipment: 'peso_corporal' },
];

export function getMuscleGroupLabel(key) {
  return MUSCLE_GROUPS.find((m) => m.key === key)?.label ?? key;
}

export function getEquipmentLabel(key) {
  return EQUIPMENT.find((e) => e.key === key)?.label ?? key;
}
