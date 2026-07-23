import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LineChart from '../../components/LineChart';
import { useAppData } from '../../context/AppDataContext';
import { GOALS } from '../../utils/calorieCalculator';
import { ageFromBirthDate, daysAgoISO, formatDateBR, todayISO } from '../../utils/date';
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

  const consistency = useMemo(() => {
    const workoutDates = new Set(workoutLogs.map((l) => l.date));
    const mealDates = new Set(mealLogs.map((m) => m.date));
    const active = new Set([...workoutDates, ...mealDates]);

    const LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // dom..sáb
    const week = [];
    for (let i = 6; i >= 0; i -= 1) {
      const iso = daysAgoISO(i);
      const dow = new Date(`${iso}T00:00:00`).getDay();
      week.push({
        iso,
        letter: LETTERS[dow],
        trained: workoutDates.has(iso),
        dieted: mealDates.has(iso),
        isToday: i === 0,
      });
    }

    // Sequência de dias ativos (treino ou dieta), com carência para hoje.
    let streak = 0;
    let startOffset = null;
    if (active.has(todayISO())) startOffset = 0;
    else if (active.has(daysAgoISO(1))) startOffset = 1;
    if (startOffset !== null) {
      let i = startOffset;
      while (active.has(daysAgoISO(i))) {
        streak += 1;
        i += 1;
      }
    }

    return {
      week,
      streak,
      workoutsThisWeek: week.filter((d) => d.trained).length,
      dietDaysThisWeek: week.filter((d) => d.dieted).length,
    };
  }, [workoutLogs, mealLogs]);

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

      {/* Constância */}
      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={22} color={colors.warning} />
          <Text style={styles.streakNum}>{consistency.streak}</Text>
          <Text style={styles.streakLabel}>
            {consistency.streak === 1 ? 'dia seguido ativo' : 'dias seguidos ativos'}
          </Text>
        </View>
        {consistency.streak === 0 ? (
          <Text style={styles.streakHint}>Registre um treino ou refeição hoje para começar.</Text>
        ) : null}

        <View style={styles.weekStrip}>
          {consistency.week.map((d) => (
            <View key={d.iso} style={styles.dayCol}>
              <Text style={[styles.dayLetter, d.isToday && styles.dayLetterToday]}>{d.letter}</Text>
              <View
                style={[
                  styles.dayCircle,
                  d.trained && styles.dayCircleTrained,
                  d.isToday && styles.dayCircleToday,
                ]}
              >
                {d.trained ? <Ionicons name="barbell" size={13} color={colors.background} /> : null}
              </View>
              <View style={[styles.dietDot, d.dieted && styles.dietDotOn]} />
            </View>
          ))}
        </View>

        <Text style={styles.legend}>
          {consistency.workoutsThisWeek} treino(s) · {consistency.dietDaysThisWeek} dia(s) com dieta
          na semana
        </Text>
      </Card>

      {/* Evolução do peso */}
      <Card style={{ marginBottom: spacing.md }}>
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
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  streakNum: { color: colors.text, fontSize: 24, fontWeight: '800' },
  streakLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  streakHint: { color: colors.textFaint, fontSize: 12, marginTop: spacing.xs },
  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  dayCol: { alignItems: 'center', gap: 5, flex: 1 },
  dayLetter: { color: colors.textFaint, fontSize: 11, fontWeight: '600' },
  dayLetterToday: { color: colors.accent },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayCircleTrained: { backgroundColor: colors.primary },
  dayCircleToday: { borderColor: colors.accent },
  dietDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dietDotOn: { backgroundColor: colors.accent },
  legend: { color: colors.textFaint, fontSize: 12, marginTop: spacing.md, textAlign: 'center' },

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
