import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Screen from '../../components/Screen';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAppData } from '../../context/AppDataContext';
import {
  generateWorkoutPlan,
  GENERATOR_GOALS,
  GENERATOR_PLACES,
  GENERATOR_LEVELS,
} from '../../utils/workoutGenerator';
import { colors, spacing, radius } from '../../theme/colors';

export default function WorkoutGeneratorScreen({ navigation }) {
  const { saveWorkoutTemplate, getExerciseById } = useAppData();
  const [goalKey, setGoalKey] = useState('hipertrofia');
  const [placeKey, setPlaceKey] = useState('academia');
  const [levelKey, setLevelKey] = useState('intermediario');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [preview, setPreview] = useState(null);

  function handleGenerate() {
    const plan = generateWorkoutPlan({ goalKey, daysPerWeek, placeKey, levelKey });
    setPreview(plan);
  }

  async function handleSaveAll() {
    for (const template of preview) {
      await saveWorkoutTemplate(template);
    }
    navigation.navigate('WorkoutHome');
  }

  return (
    <Screen>
      <Text style={styles.label}>Objetivo</Text>
      <View style={styles.chipRow}>
        {GENERATOR_GOALS.map((g) => (
          <Chip key={g.key} label={g.label} selected={goalKey === g.key} onPress={() => setGoalKey(g.key)} />
        ))}
      </View>

      <Text style={styles.label}>Dias por semana</Text>
      <View style={styles.stepper}>
        <Pressable
          style={styles.stepperBtn}
          onPress={() => setDaysPerWeek((d) => Math.max(2, d - 1))}
        >
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{daysPerWeek}</Text>
        <Pressable
          style={styles.stepperBtn}
          onPress={() => setDaysPerWeek((d) => Math.min(6, d + 1))}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Onde treina</Text>
      <View style={styles.chipRow}>
        {GENERATOR_PLACES.map((p) => (
          <Chip key={p.key} label={p.label} selected={placeKey === p.key} onPress={() => setPlaceKey(p.key)} />
        ))}
      </View>

      <Text style={styles.label}>Nível</Text>
      <View style={styles.chipRow}>
        {GENERATOR_LEVELS.map((l) => (
          <Chip key={l.key} label={l.label} selected={levelKey === l.key} onPress={() => setLevelKey(l.key)} />
        ))}
      </View>

      <Button title="Gerar treino" onPress={handleGenerate} style={{ marginTop: spacing.md }} />

      {preview ? (
        <View style={{ marginTop: spacing.lg }}>
          {preview.map((template, i) => (
            <Card key={i} style={{ marginBottom: spacing.sm }}>
              <Text style={styles.templateName}>{template.name}</Text>
              {template.exerciseEntries.map((entry, j) => {
                const exercise = getExerciseById(entry.exerciseId);
                return (
                  <Text key={j} style={styles.exerciseLine}>
                    • {exercise?.name} — {entry.targetSets}x{entry.targetRepsMin}-{entry.targetRepsMax}
                  </Text>
                );
              })}
            </Card>
          ))}
          <Button title="Salvar treinos" onPress={handleSaveAll} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textMuted, marginBottom: spacing.sm, fontSize: 13, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  stepper: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  stepperValue: { color: colors.text, fontSize: 16, fontWeight: '700', width: 40, textAlign: 'center' },
  templateName: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: spacing.xs },
  exerciseLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
