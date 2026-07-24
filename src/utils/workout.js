import { getMuscleGroupLabel } from '../data/exerciseLibrary';

// Resumo dos grupos musculares de um treino, na ordem em que aparecem, sem
// repetir. Ex: "Peito · Tríceps · Ombro".
export function muscleGroupSummary(entries, getExerciseById) {
  const seen = [];
  (entries ?? []).forEach((e) => {
    const ex = getExerciseById(e.exerciseId);
    if (ex?.muscleGroup && !seen.includes(ex.muscleGroup)) seen.push(ex.muscleGroup);
  });
  return seen.map(getMuscleGroupLabel).join(' · ');
}
