// Progressão dupla: sobe carga quando todas as séries batem o topo da faixa
// de reps; senão, sugere manter a carga e tentar mais uma rep.
export function suggestNextSession({ lastSets, targetRepsMin, targetRepsMax, incrementKg }) {
  if (!lastSets || lastSets.length === 0) return null;

  const lastWeight = lastSets[lastSets.length - 1].weight;
  const allHitTop = lastSets.every((s) => s.reps >= targetRepsMax);

  if (allHitTop) {
    return {
      suggestedWeight: roundToHalf(lastWeight + incrementKg),
      suggestedReps: targetRepsMin,
      message: `Última vez você bateu ${targetRepsMax} reps em todas as séries. Suba para ${roundToHalf(lastWeight + incrementKg)}kg.`,
    };
  }

  const lowestReps = Math.min(...lastSets.map((s) => s.reps));
  return {
    suggestedWeight: lastWeight,
    suggestedReps: Math.min(lowestReps + 1, targetRepsMax),
    message: `Mantenha ${lastWeight}kg e tente ${Math.min(lowestReps + 1, targetRepsMax)} reps.`,
  };
}

function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

export function computeVolume(sets) {
  return sets.reduce((total, s) => total + (s.reps || 0) * (s.weight || 0), 0);
}

export function computeMaxWeight(sets) {
  return sets.reduce((max, s) => Math.max(max, s.weight || 0), 0);
}

// Soma o tempo (min) de séries de cardio.
export function computeTotalDuration(sets) {
  return sets.reduce((total, s) => total + (s.durationMin || 0), 0);
}

// Compara um novo lançamento com o histórico de sessões anteriores do mesmo
// exercício para detectar recorde pessoal de carga e de volume.
export function detectPersonalRecords({ newSets, previousLogs }) {
  const newMaxWeight = computeMaxWeight(newSets);
  const newVolume = computeVolume(newSets);

  const previousMaxWeight = previousLogs.reduce(
    (max, log) => Math.max(max, computeMaxWeight(log.sets)),
    0
  );
  const previousMaxVolume = previousLogs.reduce(
    (max, log) => Math.max(max, computeVolume(log.sets)),
    0
  );

  return {
    isWeightPR: previousLogs.length > 0 && newMaxWeight > previousMaxWeight,
    isVolumePR: previousLogs.length > 0 && newVolume > previousMaxVolume,
    newMaxWeight,
    newVolume,
    previousMaxWeight,
    previousMaxVolume,
  };
}
