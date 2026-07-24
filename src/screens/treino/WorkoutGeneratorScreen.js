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
  GENERATOR_TIMES,
  GENERATOR_BLOCKS,
} from '../../utils/workoutGenerator';
import { colors, spacing, radius } from '../../theme/colors';

export default function WorkoutGeneratorScreen({ navigation }) {
  const { saveWorkoutTemplates, getExerciseById } = useAppData();
  const [goalKey, setGoalKey] = useState('hipertrofia');
  const [placeKey, setPlaceKey] = useState('academia');
  const [levelKey, setLevelKey] = useState('intermediario');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [timeKey, setTimeKey] = useState(60);
  const [blockMonths, setBlockMonths] = useState(1);
  const [preview, setPreview] = useState(null);
  // Ênfase do superior é definida internamente (o usuário não precisa escolher).
  const emphasis = 'antagonista';

  function handleGenerate() {
    const plan = generateWorkoutPlan({
      goalKey,
      daysPerWeek,
      placeKey,
      levelKey,
      timeKey,
      blockMonths,
      emphasis,
    });
    setPreview(plan);
  }

  async function handleSaveAll() {
    await saveWorkoutTemplates(preview);
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

      <Text style={styles.label}>Tempo por treino</Text>
      <View style={styles.chipRow}>
        {GENERATOR_TIMES.map((t) => (
          <Chip key={t.key} label={t.label} selected={timeKey === t.key} onPress={() => setTimeKey(t.key)} />
        ))}
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

      <Text style={styles.label}>Por quantos meses vai treinar?</Text>
      <View style={styles.chipRow}>
        {GENERATOR_BLOCKS.map((b) => (
          <Chip key={b.key} label={b.label} selected={blockMonths === b.key} onPress={() => setBlockMonths(b.key)} />
        ))}
      </View>
      <Text style={styles.hint}>
        Depois desse período, gere um treino novo para variar o estímulo e continuar evoluindo.
      </Text>

      <Button title="Gerar treino" onPress={handleGenerate} style={{ marginTop: spacing.md }} />

      {preview ? (
        <View style={{ marginTop: spacing.lg }}>
          {preview.map((template, i) => (
            <Card key={i} style={{ marginBottom: spacing.sm }}>
              <Text style={styles.templateName}>{template.name}</Text>
              {template.exerciseEntries.map((entry, j) => {
                const exercise = getExerciseById(entry.exerciseId);
                const isCardio = exercise?.muscleGroup === 'cardio';
                return (
                  <Text key={j} style={styles.exerciseLine}>
                    • {exercise?.name} —{' '}
                    {isCardio
                      ? `${entry.targetDurationMin} min`
                      : `${entry.targetSets}x${entry.targetRepsMin}-${entry.targetRepsMax}`}
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
  hint: { color: colors.textFaint, fontSize: 12, lineHeight: 17, marginTop: -spacing.xs },
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
