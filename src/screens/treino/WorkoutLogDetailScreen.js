import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { confirmAction } from '../../utils/confirm';
import { computeVolume } from '../../utils/progression';
import { formatDateBR } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

export default function WorkoutLogDetailScreen({ navigation, route }) {
  const { workoutLogs, deleteWorkoutLog } = useAppData();
  const log = workoutLogs.find((l) => l.id === route.params?.logId);

  if (!log) {
    return (
      <Screen>
        <Text style={styles.empty}>Treino não encontrado.</Text>
      </Screen>
    );
  }

  const totalSets = log.entries.reduce((sum, e) => sum + e.sets.length, 0);

  function handleDelete() {
    confirmAction({
      title: 'Excluir treino',
      message: `Remover o treino de ${formatDateBR(log.date)}?`,
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        await deleteWorkoutLog(log.id);
        navigation.goBack();
      },
    });
  }

  return (
    <Screen>
      <Text style={styles.date}>{formatDateBR(log.date)}</Text>
      <Text style={styles.title}>{log.templateName || 'Treino avulso'}</Text>
      <Text style={styles.summary}>
        {log.entries.length} exercício(s) · {totalSets} série(s)
      </Text>

      {log.entries.map((entry, i) => {
        const isCardio = entry.sets.some((s) => s.durationMin != null);
        const volume = isCardio ? null : computeVolume(entry.sets);
        return (
          <Card key={i} style={{ marginTop: spacing.md }}>
            <Text style={styles.exerciseName}>{entry.exerciseName || 'Exercício'}</Text>
            {entry.sets.map((s, si) => (
              <Text key={si} style={styles.setLine}>
                {s.durationMin != null
                  ? `Tempo: ${s.durationMin} min`
                  : `Série ${si + 1}: ${s.weight}kg × ${s.reps} reps`}
              </Text>
            ))}
            {volume ? <Text style={styles.volume}>Volume: {volume} kg</Text> : null}
          </Card>
        );
      })}

      <Button
        title="Excluir treino"
        variant="danger"
        onPress={handleDelete}
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  date: { color: colors.textFaint, fontSize: 12 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 2 },
  summary: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  exerciseName: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: spacing.xs },
  setLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  volume: { color: colors.textFaint, fontSize: 12, marginTop: spacing.xs },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
