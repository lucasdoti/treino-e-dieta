import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Screen from '../../components/Screen';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAppData } from '../../context/AppDataContext';
import { confirmAction, notify } from '../../utils/confirm';
import { colors, spacing, radius } from '../../theme/colors';

export default function WorkoutTemplateEditorScreen({ navigation, route }) {
  const { workoutTemplates, saveWorkoutTemplate, deleteWorkoutTemplate, getExerciseById } =
    useAppData();
  const editing = workoutTemplates.find((t) => t.id === route.params?.templateId);

  const [name, setName] = useState(editing?.name ?? '');
  const [exerciseEntries, setExerciseEntries] = useState(editing?.exerciseEntries ?? []);

  function defaultEntryFor(exercise) {
    if (exercise.muscleGroup === 'cardio') {
      return { exerciseId: exercise.id, targetDurationMin: 20 };
    }
    return { exerciseId: exercise.id, targetSets: 3, targetRepsMin: 8, targetRepsMax: 12 };
  }

  function addEntry(exercise) {
    setExerciseEntries((prev) => [...prev, defaultEntryFor(exercise)]);
  }

  function updateEntry(index, changes) {
    setExerciseEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...changes } : e)));
  }

  function removeEntry(index) {
    setExerciseEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function swapEntry(index, exercise) {
    setExerciseEntries((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e;
        const current = getExerciseById(e.exerciseId);
        // Se trocar entre cardio e musculação, redefine os campos de alvo.
        if ((current?.muscleGroup === 'cardio') !== (exercise.muscleGroup === 'cardio')) {
          return defaultEntryFor(exercise);
        }
        return { ...e, exerciseId: exercise.id };
      })
    );
  }

  async function handleSave() {
    if (!name.trim()) {
      notify('Ops', 'Dê um nome para o treino.');
      return;
    }
    if (exerciseEntries.length === 0) {
      notify('Ops', 'Adicione pelo menos um exercício.');
      return;
    }
    await saveWorkoutTemplate({ id: editing?.id, name: name.trim(), exerciseEntries });
    navigation.goBack();
  }

  function handleDelete() {
    confirmAction({
      title: 'Excluir treino',
      message: `Remover "${editing.name}"?`,
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        await deleteWorkoutTemplate(editing.id);
        navigation.goBack();
      },
    });
  }

  return (
    <Screen>
      <TextField label="Nome do treino" value={name} onChangeText={setName} placeholder="Ex: Treino A" />

      {exerciseEntries.map((entry, index) => {
        const exercise = getExerciseById(entry.exerciseId);
        const isCardio = exercise?.muscleGroup === 'cardio';
        return (
          <Card key={index} style={{ marginBottom: spacing.sm }}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryName}>{exercise?.name ?? 'Exercício'}</Text>
              <View style={styles.entryActions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('ExercisePicker', {
                      initialGroup: exercise?.muscleGroup ?? null,
                      onSelect: (picked) => swapEntry(index, picked),
                    })
                  }
                  hitSlop={8}
                >
                  <Ionicons name="swap-horizontal" size={19} color={colors.accent} />
                </Pressable>
                <Pressable onPress={() => removeEntry(index)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </View>
            </View>
            {isCardio ? (
              <View style={styles.numberRow}>
                <NumberField
                  label="Tempo (min)"
                  value={entry.targetDurationMin ?? 20}
                  onChange={(v) => updateEntry(index, { targetDurationMin: v })}
                  step={5}
                  min={5}
                />
              </View>
            ) : (
              <View style={styles.numberRow}>
                <NumberField
                  label="Séries"
                  value={entry.targetSets}
                  onChange={(v) => updateEntry(index, { targetSets: v })}
                />
                <NumberField
                  label="Reps min"
                  value={entry.targetRepsMin}
                  onChange={(v) => updateEntry(index, { targetRepsMin: v })}
                />
                <NumberField
                  label="Reps max"
                  value={entry.targetRepsMax}
                  onChange={(v) => updateEntry(index, { targetRepsMax: v })}
                />
              </View>
            )}
          </Card>
        );
      })}

      <Button
        title="+ Adicionar exercício"
        variant="outline"
        onPress={() => navigation.navigate('ExercisePicker', { onSelect: addEntry })}
        style={{ marginBottom: spacing.md }}
      />

      <Button title="Salvar treino" onPress={handleSave} />
      {editing ? (
        <Button title="Excluir treino" variant="danger" onPress={handleDelete} style={{ marginTop: spacing.sm }} />
      ) : null}
    </Screen>
  );
}

function NumberField({ label, value, onChange, step = 1, min = 1 }) {
  return (
    <View style={styles.numberField}>
      <Text style={styles.numberLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable onPress={() => onChange(Math.max(min, value - step))} style={styles.stepperBtn}>
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable onPress={() => onChange(value + step)} style={styles.stepperBtn}>
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  entryName: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  entryActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  numberRow: { flexDirection: 'row', justifyContent: 'space-between' },
  numberField: { alignItems: 'center' },
  numberLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  stepperValue: { color: colors.text, fontSize: 15, fontWeight: '700', width: 30, textAlign: 'center' },
});
