import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import RestTimer from '../../components/RestTimer';
import { useAppData } from '../../context/AppDataContext';
import { suggestNextSession, detectPersonalRecords } from '../../utils/progression';
import { muscleGroupSummary } from '../../utils/workout';
import { notify } from '../../utils/confirm';
import { todayISO, formatDateBR } from '../../utils/date';
import { colors, spacing, radius } from '../../theme/colors';

export default function WorkoutSessionScreen({ navigation, route }) {
  const { workoutTemplates, getExerciseById, getLogsForExercise, addWorkoutLog, profile } =
    useAppData();
  const template = workoutTemplates.find((t) => t.id === route.params?.templateId);
  const logDate = route.params?.logDate ?? todayISO();

  const [sessionExercises, setSessionExercises] = useState(() => {
    if (!template) return [];
    return template.exerciseEntries.map((entry) => ({
      exerciseId: entry.exerciseId,
      targetSets: entry.targetSets ?? null,
      targetRepsMin: entry.targetRepsMin,
      targetRepsMax: entry.targetRepsMax,
      targetDurationMin: entry.targetDurationMin ?? null,
      sets: [],
      draftReps: '',
      draftWeight: '',
      draftDuration: '',
    }));
  });

  const [restSignal, setRestSignal] = useState(0);

  function addExercise(exercise) {
    setSessionExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        targetRepsMin: null,
        targetRepsMax: null,
        targetDurationMin: null,
        sets: [],
        draftReps: '',
        draftWeight: '',
        draftDuration: '',
      },
    ]);
  }

  function removeExercise(index) {
    setSessionExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function updateDraft(index, changes) {
    setSessionExercises((prev) => prev.map((e, i) => (i === index ? { ...e, ...changes } : e)));
  }

  function addSet(index) {
    let added = false;
    setSessionExercises((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e;
        const exercise = getExerciseById(e.exerciseId);
        if (exercise?.muscleGroup === 'cardio') {
          const durationMin = parseFloat(String(e.draftDuration).replace(',', '.'));
          if (!durationMin) return e;
          added = true;
          return { ...e, sets: [...e.sets, { durationMin }], draftDuration: '' };
        }
        const reps = parseInt(e.draftReps, 10);
        const weight = parseFloat(e.draftWeight.replace(',', '.'));
        if (!reps || Number.isNaN(weight)) return e;
        added = true;
        return { ...e, sets: [...e.sets, { reps, weight }], draftReps: '', draftWeight: '' };
      })
    );
    if (added) setRestSignal((s) => s + 1); // dispara o cronômetro de descanso
  }

  function removeSet(exerciseIndex, setIndex) {
    setSessionExercises((prev) =>
      prev.map((e, i) =>
        i === exerciseIndex ? { ...e, sets: e.sets.filter((_, si) => si !== setIndex) } : e
      )
    );
  }

  async function handleFinish() {
    const withSets = sessionExercises.filter((e) => e.sets.length > 0);
    if (withSets.length === 0) {
      notify('Ops', 'Registre ao menos uma série antes de salvar.');
      return;
    }

    const prMessages = [];
    const entries = withSets.map((e) => {
      const exercise = getExerciseById(e.exerciseId);
      if (exercise?.muscleGroup !== 'cardio') {
        const previousLogs = getLogsForExercise(e.exerciseId);
        const pr = detectPersonalRecords({ newSets: e.sets, previousLogs });
        if (pr.isWeightPR) prMessages.push(`🔥 Recorde de carga em ${exercise?.name}: ${pr.newMaxWeight}kg`);
        if (pr.isVolumePR) prMessages.push(`🔥 Recorde de volume em ${exercise?.name}`);
      }
      return { exerciseId: e.exerciseId, exerciseName: exercise?.name ?? '', sets: e.sets };
    });

    await addWorkoutLog({
      date: logDate,
      templateId: template?.id ?? null,
      templateName: template?.name ?? 'Treino avulso',
      entries,
    });

    if (prMessages.length > 0) {
      notify('Novo recorde!', prMessages.join('\n'), () => navigation.navigate('WorkoutHome'));
    } else {
      navigation.navigate('WorkoutHome');
    }
  }

  return (
    <Screen>
      <Text style={styles.date}>{formatDateBR(logDate)}</Text>
      <Text style={styles.title}>{template?.name ?? 'Treino avulso'}</Text>
      {template ? (
        <Text style={styles.groups}>
          {muscleGroupSummary(template.exerciseEntries, getExerciseById)}
        </Text>
      ) : null}

      <RestTimer defaultSeconds={profile.restSeconds ?? 90} startSignal={restSignal} />

      {sessionExercises.map((entry, index) => {
        const exercise = getExerciseById(entry.exerciseId);
        const isCardio = exercise?.muscleGroup === 'cardio';
        const previousLogs = getLogsForExercise(entry.exerciseId);
        const lastLog = previousLogs[previousLogs.length - 1];
        const suggestion =
          !isCardio && entry.targetRepsMin && lastLog
            ? suggestNextSession({
                lastSets: lastLog.sets,
                targetRepsMin: entry.targetRepsMin,
                targetRepsMax: entry.targetRepsMax,
                incrementKg: isLowerBody(exercise?.muscleGroup)
                  ? profile.incrementLowerKg
                  : profile.incrementUpperKg,
              })
            : null;

        return (
          <Card key={index} style={{ marginBottom: spacing.md }}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryName}>{exercise?.name ?? 'Exercício'}</Text>
              <View style={styles.entryHeaderActions}>
                {exercise ? (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })
                    }
                    hitSlop={8}
                  >
                    <Ionicons name="help-circle-outline" size={20} color={colors.accent} />
                  </Pressable>
                ) : null}
                <Pressable onPress={() => removeExercise(index)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={colors.textFaint} />
                </Pressable>
              </View>
            </View>

            {isCardio && entry.targetDurationMin ? (
              <Text style={styles.meta}>Alvo: {entry.targetDurationMin} min</Text>
            ) : null}
            {!isCardio && entry.targetRepsMin ? (
              <Text style={styles.meta}>
                Alvo: {entry.targetSets ? `${entry.targetSets} séries de ` : ''}
                {entry.targetRepsMin} a {entry.targetRepsMax} reps
              </Text>
            ) : null}

            {suggestion ? <Text style={styles.suggestion}>{suggestion.message}</Text> : null}
            {!suggestion && lastLog ? (
              <Text style={styles.reference}>
                Última vez:{' '}
                {isCardio
                  ? lastLog.sets.map((s) => `${s.durationMin} min`).join(', ')
                  : lastLog.sets.map((s) => `${s.weight}kg x${s.reps}`).join(', ')}
              </Text>
            ) : null}

            {entry.sets.map((s, si) => (
              <View key={si} style={styles.setRow}>
                <Text style={styles.setText}>
                  {isCardio
                    ? `Tempo: ${s.durationMin} min`
                    : `Série ${si + 1}: ${s.weight}kg x ${s.reps} reps`}
                </Text>
                <Pressable onPress={() => removeSet(index, si)}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </Pressable>
              </View>
            ))}

            {isCardio ? (
              <View style={styles.draftRow}>
                <TextField
                  containerStyle={styles.draftField}
                  placeholder="Tempo (min)"
                  keyboardType="number-pad"
                  value={entry.draftDuration}
                  onChangeText={(v) => updateDraft(index, { draftDuration: v })}
                />
                <Pressable style={styles.addSetBtn} onPress={() => addSet(index)}>
                  <Ionicons name="add" size={20} color={colors.background} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.draftRow}>
                <TextField
                  containerStyle={styles.draftField}
                  placeholder="Peso (kg)"
                  keyboardType="decimal-pad"
                  value={entry.draftWeight}
                  onChangeText={(v) => updateDraft(index, { draftWeight: v })}
                />
                <TextField
                  containerStyle={styles.draftField}
                  placeholder="Reps"
                  keyboardType="number-pad"
                  value={entry.draftReps}
                  onChangeText={(v) => updateDraft(index, { draftReps: v })}
                />
                <Pressable style={styles.addSetBtn} onPress={() => addSet(index)}>
                  <Ionicons name="add" size={20} color={colors.background} />
                </Pressable>
              </View>
            )}
          </Card>
        );
      })}

      <Button
        title="+ Adicionar exercício"
        variant="outline"
        onPress={() => navigation.navigate('ExercisePicker', { onSelect: addExercise })}
        style={{ marginBottom: spacing.md }}
      />

      <Button title="Salvar treino" onPress={handleFinish} />
    </Screen>
  );
}

function isLowerBody(muscleGroup) {
  return ['quadriceps', 'posterior', 'panturrilha'].includes(muscleGroup);
}

const styles = StyleSheet.create({
  date: { color: colors.textFaint, fontSize: 12 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  groups: { color: colors.primary, fontSize: 13, fontWeight: '600', marginTop: 2, marginBottom: spacing.md },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  entryName: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  suggestion: { color: colors.primary, fontSize: 12, marginTop: spacing.xs, fontWeight: '600' },
  reference: { color: colors.textFaint, fontSize: 12, marginTop: spacing.xs },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  setText: { color: colors.text, fontSize: 13 },
  draftRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  draftField: { flex: 1, marginBottom: 0 },
  addSetBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
