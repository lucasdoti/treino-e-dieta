// Tipos de refeição usados no diário e nos cardápios.
export const MEAL_TYPES = [
  { key: 'cafe_da_manha', label: 'Café da manhã' },
  { key: 'almoco', label: 'Almoço' },
  { key: 'lanche', label: 'Lanche' },
  { key: 'jantar', label: 'Jantar' },
  { key: 'ceia', label: 'Ceia' },
  { key: 'outro', label: 'Outro' },
];

export function mealTypeLabel(key) {
  return MEAL_TYPES.find((m) => m.key === key)?.label ?? key;
}
