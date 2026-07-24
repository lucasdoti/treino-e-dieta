import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { muscleGroupSummary } from '../../utils/workout';
import { RESTRICTIONS } from '../../data/restrictions';
import { colors, spacing, radius } from '../../theme/colors';

export default function WorkoutGeneratorScreen({ navigation }) {
  const { saveWorkoutTemplates, getExerciseById } = useAppData();
  const [goalKey, setGoalKey] = useState('hipertrofia');
  const [placeKey, setPlaceKey] = useState('academia');
  const [levelKey, setLevelKey] = useState('intermediario');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [timeKey, setTimeKey] = useState(60);
  const [blockMonths, setBlockMonths] = useState(1);
  const [restrictions, setRestrictions] = useState([]);
  const [preview, setPreview] = useState(null);

  function toggleRestriction(key) {
    setRestrictions((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleGenerate() {
    const plan = generateWorkoutPlan({
      goalKey,
      daysPerWeek,
      placeKey,
      levelKey,
      timeKey,
      blockMonths,
      restrictions,
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

      <Text style={styles.label}>Duração até renovar o treino</Text>
      <View style={styles.chipRow}>
        {GENERATOR_BLOCKS.map((b) => (
          <Chip key={b.key} label={b.label} selected={blockMonths === b.key} onPress={() => setBlockMonths(b.key)} />
        ))}
      </View>
      <Text style={styles.hint}>
        Você segue com este treino por esse período. Ao terminar, é só gerar o próximo para variar o
        estímulo e continuar evoluindo.
      </Text>

      <Text style={styles.label}>Restrições / adaptações</Text>
      <View style={styles.chipRow}>
        {RESTRICTIONS.map((r) => (
          <Chip
            key={r.key}
            label={r.label}
            selected={restrictions.includes(r.key)}
            onPress={() => toggleRestriction(r.key)}
          />
        ))}
      </View>
      {restrictions.length > 0 ? (
        <View style={styles.warning}>
          <Ionicons name="warning-outline" size={16} color={colors.warning} />
          <Text style={styles.warningText}>
            As adaptações são precauções gerais e removem exercícios de maior risco. Não substituem
            avaliação médica. Em caso de gravidez, lesão ou condição de saúde, confirme com seu médico
            e um profissional de educação física.
          </Text>
        </View>
      ) : null}

      <Button title="Gerar treino" onPress={handleGenerate} style={{ marginTop: spacing.md }} />

      {preview ? (
        <View style={{ marginTop: spacing.lg }}>
          {preview.map((template, i) => (
            <Card key={i} style={{ marginBottom: spacing.sm }}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateGroups}>
                {muscleGroupSummary(template.exerciseEntries, getExerciseById)}
              </Text>
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
  warning: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  warningText: { color: colors.textMuted, fontSize: 12, lineHeight: 17, flex: 1 },
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
  templateName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  templateGroups: { color: colors.primary, fontSize: 12, fontWeight: '600', marginBottom: spacing.xs, marginTop: 2 },
  exerciseLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
