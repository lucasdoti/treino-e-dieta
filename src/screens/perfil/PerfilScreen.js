import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LineChart from '../../components/LineChart';
import { useAppData } from '../../context/AppDataContext';
import { GOALS } from '../../utils/calorieCalculator';
import { ageFromBirthDate, daysAgoISO, formatDateBR } from '../../utils/date';
import { colors, spacing, radius } from '../../theme/colors';

function initialsFrom(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function PerfilScreen({ navigation }) {
  const { profile, workoutLogs, bodyWeightLogs, mealLogs } = useAppData();

  const age = ageFromBirthDate(profile.birthDate);
  const goalLabel = GOALS.find((g) => g.key === profile.goalKey)?.label;
  const sexLabel = profile.sex === 'feminino' ? 'Feminino' : 'Masculino';
  const initials = initialsFrom(profile.name ?? '');

  const stats = useMemo(() => {
    const weekAgo = daysAgoISO(6);
    const workoutsThisWeek = workoutLogs.filter((l) => l.date >= weekAgo).length;

    const sortedBW = [...bodyWeightLogs].sort((a, b) => (a.date < b.date ? -1 : 1));
    const currentWeight = sortedBW.length ? sortedBW[sortedBW.length - 1].weightKg : profile.weightKg;
    const firstWeight = sortedBW.length ? sortedBW[0].weightKg : null;
    const weightDelta = sortedBW.length >= 2 ? currentWeight - firstWeight : null;

    const caloriesLast7 = mealLogs
      .filter((m) => m.date >= weekAgo)
      .reduce((sum, log) => sum + log.entries.reduce((s, e) => s + e.calories, 0), 0);
    const avgCalories = Math.round(caloriesLast7 / 7);

    const weightPoints = sortedBW.map((b) => ({
      label: formatDateBR(b.date).slice(0, 5),
      value: b.weightKg,
    }));

    return {
      totalWorkouts: workoutLogs.length,
      workoutsThisWeek,
      currentWeight,
      weightDelta,
      avgCalories,
      weightPoints,
    };
  }, [workoutLogs, bodyWeightLogs, mealLogs, profile.weightKg]);

  const deltaText =
    stats.weightDelta === null
      ? '—'
      : `${stats.weightDelta > 0 ? '+' : ''}${stats.weightDelta.toFixed(1)}kg`;

  return (
    <Screen>
      {/* Identidade */}
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            {initials ? (
              <Text style={styles.avatarText}>{initials}</Text>
            ) : (
              <Ionicons name="person" size={28} color={colors.background} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.name?.trim() || 'Seu perfil'}</Text>
            <Text style={styles.subtitle}>
              {[goalLabel, age ? `${age} anos` : null, sexLabel].filter(Boolean).join(' · ')}
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate('ProfileSettings')} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.metricRow}>
          <Metric label="Altura" value={profile.heightCm ? `${profile.heightCm} cm` : '—'} />
          <Metric label="Peso" value={stats.currentWeight ? `${stats.currentWeight} kg` : '—'} />
          <Metric
            label="Meta"
            value={profile.calorieTarget ? `${profile.calorieTarget} kcal` : '—'}
          />
        </View>
      </Card>

      {/* Destaques */}
      <View style={styles.tileGrid}>
        <StatTile icon="barbell" label="Treinos" value={String(stats.totalWorkouts)} tint={colors.primary} />
        <StatTile icon="flame" label="Nesta semana" value={String(stats.workoutsThisWeek)} tint={colors.warning} />
        <StatTile
          icon="trending-down"
          label="Variação de peso"
          value={deltaText}
          tint={colors.accent}
        />
        <StatTile
          icon="restaurant"
          label="Média kcal/dia (7d)"
          value={stats.avgCalories ? String(stats.avgCalories) : '—'}
          tint={colors.danger}
        />
      </View>

      {/* Evolução do peso */}
      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Evolução do peso</Text>
        <LineChart
          points={stats.weightPoints}
          height={160}
          emptyMessage="Registre seu peso na aba Progresso para ver a evolução."
        />
      </Card>

      <Button title="Ver progresso completo" onPress={() => navigation.navigate('Progresso')} />
    </Screen>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function StatTile({ icon, label, value, tint }) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: tint + '22' }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.background, fontSize: 22, fontWeight: '800' },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },

  metricRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { color: colors.text, fontSize: 15, fontWeight: '700' },
  metricLabel: { color: colors.textFaint, fontSize: 11, marginTop: 2 },

  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  tileIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  tileLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing.sm },
});
