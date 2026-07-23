import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { mealTypeLabel } from '../../data/mealTypes';
import { todayISO, formatDateBR, addDaysISO } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

export default function DietHomeScreen({ navigation }) {
  const { mealLogs, deleteMealLog, profile } = useAppData();
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const dayLogs = mealLogs.filter((m) => m.date === selectedDate);
  const totals = dayLogs.reduce(
    (acc, log) => {
      log.entries.forEach((e) => {
        acc.calories += e.calories;
        acc.protein += e.protein;
        acc.carbs += e.carbs;
        acc.fat += e.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const goalSet = Boolean(profile.calorieTarget);

  return (
    <Screen>
      <View style={styles.dateRow}>
        <Pressable onPress={() => setSelectedDate((d) => addDaysISO(d, -1))}>
          <Ionicons name="chevron-back" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.dateText}>{formatDateBR(selectedDate)}</Text>
        <Pressable onPress={() => setSelectedDate((d) => addDaysISO(d, 1))}>
          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.totalCalories}>
          {totals.calories} {goalSet ? `/ ${profile.calorieTarget}` : ''} kcal
        </Text>
        <Text style={styles.macroLine}>
          Proteína {totals.protein}
          {goalSet ? `/${profile.macroTargets.proteinG}` : ''}g · Carbo {totals.carbs}
          {goalSet ? `/${profile.macroTargets.carbsG}` : ''}g · Gordura {totals.fat}
          {goalSet ? `/${profile.macroTargets.fatG}` : ''}g
        </Text>
        {!goalSet ? (
          <Button
            title="Definir meta"
            variant="outline"
            onPress={() => navigation.navigate('GoalSetup')}
            style={{ marginTop: spacing.sm }}
          />
        ) : null}
      </Card>

      {dayLogs.map((log) => (
        <Card key={log.id} style={{ marginBottom: spacing.sm }}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealType}>{mealTypeLabel(log.mealType)}</Text>
            <Pressable onPress={() => deleteMealLog(log.id)}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
            </Pressable>
          </View>
          {log.entries.map((e, i) => (
            <Text key={i} style={styles.entryLine}>
              {e.foodName} ({e.grams}g) — {e.calories} kcal
            </Text>
          ))}
        </Card>
      ))}

      <Button
        title="+ Adicionar refeição"
        onPress={() => navigation.navigate('AddMealEntry', { date: selectedDate })}
        style={{ marginTop: spacing.sm, marginBottom: spacing.sm }}
      />
      <View style={styles.actionsRow}>
        <Button
          title="Cardápios"
          variant="outline"
          onPress={() => navigation.navigate('MealPlanList')}
          style={styles.actionBtn}
        />
        <Button
          title="Alimentos"
          variant="outline"
          onPress={() => navigation.navigate('FoodCatalog')}
          style={styles.actionBtn}
        />
      </View>
      {goalSet ? (
        <Button
          title="Ajustar meta"
          variant="outline"
          onPress={() => navigation.navigate('GoalSetup')}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  dateText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
  totalCalories: { color: colors.text, fontSize: 22, fontWeight: '800' },
  macroLine: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  mealType: { color: colors.text, fontSize: 14, fontWeight: '700' },
  entryLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
