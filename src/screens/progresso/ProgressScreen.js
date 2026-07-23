import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import LineChart from '../../components/LineChart';
import { useAppData } from '../../context/AppDataContext';
import { computeMaxWeight, computeVolume, computeTotalDuration } from '../../utils/progression';
import { todayISO, formatDateBR, daysAgoISO } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

const SECTIONS = [
  { key: 'peso', label: 'Peso corporal' },
  { key: 'carga', label: 'Carga por exercício' },
  { key: 'calorias', label: 'Calorias' },
];

export default function ProgressScreen() {
  const [section, setSection] = useState('peso');

  return (
    <Screen>
      <View style={styles.chipRow}>
        {SECTIONS.map((s) => (
          <Chip key={s.key} label={s.label} selected={section === s.key} onPress={() => setSection(s.key)} />
        ))}
      </View>

      {section === 'peso' && <BodyWeightSection />}
      {section === 'carga' && <ExerciseProgressSection />}
      {section === 'calorias' && <CaloriesSection />}
    </Screen>
  );
}

function BodyWeightSection() {
  const { bodyWeightLogs, addBodyWeightLog, profile } = useAppData();
  const [weight, setWeight] = useState('');

  const sorted = [...bodyWeightLogs].sort((a, b) => (a.date < b.date ? -1 : 1));
  const points = sorted.map((b) => ({ label: formatDateBR(b.date).slice(0, 5), value: b.weightKg }));
  const smoothed = profile.weightFrequency === 'diario' ? movingAverage(points, 7) : points;

  async function handleAdd() {
    const value = parseFloat(weight.replace(',', '.'));
    if (!value) return;
    await addBodyWeightLog({ date: todayISO(), weightKg: value });
    setWeight('');
  }

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <LineChart points={smoothed} emptyMessage="Registre seu peso para ver o gráfico." />
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Registrar peso de hoje</Text>
        <View style={styles.addRow}>
          <TextField
            containerStyle={{ flex: 1, marginBottom: 0 }}
            placeholder="Peso (kg)"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
          <Button title="Salvar" onPress={handleAdd} style={{ marginLeft: spacing.sm }} />
        </View>
      </Card>
    </View>
  );
}

function ExerciseProgressSection() {
  const { workoutLogs, getExerciseById, getLogsForExercise } = useAppData();
  const [metric, setMetric] = useState('peso');

  const exerciseIds = useMemo(() => {
    const ids = new Set();
    workoutLogs.forEach((log) => log.entries.forEach((e) => ids.add(e.exerciseId)));
    return [...ids];
  }, [workoutLogs]);

  const [selectedId, setSelectedId] = useState(exerciseIds[0] ?? null);

  const selectedExercise = selectedId ? getExerciseById(selectedId) : null;
  const isCardio = selectedExercise?.muscleGroup === 'cardio';

  const history = selectedId ? getLogsForExercise(selectedId) : [];
  const points = history.map((h) => ({
    label: formatDateBR(h.date).slice(0, 5),
    value: isCardio
      ? computeTotalDuration(h.sets)
      : metric === 'peso'
        ? computeMaxWeight(h.sets)
        : computeVolume(h.sets),
  }));

  if (exerciseIds.length === 0) {
    return (
      <Card>
        <Text style={styles.empty}>Lance alguns treinos primeiro para ver a evolução por exercício.</Text>
      </Card>
    );
  }

  return (
    <View>
      <View style={styles.chipRow}>
        {exerciseIds.map((id) => {
          const ex = getExerciseById(id);
          return (
            <Chip key={id} label={ex?.name ?? id} selected={selectedId === id} onPress={() => setSelectedId(id)} />
          );
        })}
      </View>
      {isCardio ? (
        <Text style={styles.metricNote}>Tempo por sessão (min)</Text>
      ) : (
        <View style={styles.chipRow}>
          <Chip label="Carga máxima" selected={metric === 'peso'} onPress={() => setMetric('peso')} />
          <Chip label="Volume" selected={metric === 'volume'} onPress={() => setMetric('volume')} />
        </View>
      )}
      <Card>
        <LineChart points={points} color={colors.accent} />
      </Card>
    </View>
  );
}

function CaloriesSection() {
  const { mealLogs, profile } = useAppData();

  const points = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i -= 1) {
      const date = daysAgoISO(i);
      const total = mealLogs
        .filter((m) => m.date === date)
        .reduce((sum, log) => sum + log.entries.reduce((s, e) => s + e.calories, 0), 0);
      days.push({ label: formatDateBR(date).slice(0, 5), value: total });
    }
    return days;
  }, [mealLogs]);

  return (
    <View>
      <Card>
        <Text style={styles.cardTitle}>Últimos 14 dias</Text>
        <LineChart points={points} color={colors.warning} targetValue={profile.calorieTarget || undefined} />
      </Card>
    </View>
  );
}

function movingAverage(points, windowSize) {
  return points.map((p, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const slice = points.slice(start, i + 1);
    const avg = slice.reduce((sum, s) => sum + s.value, 0) / slice.length;
    return { label: p.label, value: Math.round(avg * 10) / 10 };
  });
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 14, marginBottom: spacing.sm },
  addRow: { flexDirection: 'row', alignItems: 'center' },
  empty: { color: colors.textFaint, fontSize: 13 },
  metricNote: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: spacing.md },
});
