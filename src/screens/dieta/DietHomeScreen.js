import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressRing from '../../components/ProgressRing';
import { useAppData } from '../../context/AppDataContext';
import { mealTypeLabel } from '../../data/mealTypes';
import { todayISO, formatDateBR, addDaysISO } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

export default function DietHomeScreen({ navigation, route }) {
  const { mealLogs, deleteMealLog, profile } = useAppData();
  const [selectedDate, setSelectedDate] = useState(todayISO());

  // Ao voltar de "aplicar cardápio", abre o diário exatamente no dia aplicado.
  useEffect(() => {
    if (route.params?.date) setSelectedDate(route.params.date);
  }, [route.params?.date]);

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
        {goalSet ? (
          <>
            <View style={styles.ringRow}>
              <ProgressRing
                progress={totals.calories / profile.calorieTarget}
                color={totals.calories > profile.calorieTarget ? colors.danger : colors.primary}
              >
                <Text style={styles.ringValue}>{totals.calories}</Text>
                <Text style={styles.ringUnit}>de {profile.calorieTarget}</Text>
                <Text style={styles.ringUnit}>kcal</Text>
              </ProgressRing>
              <View style={styles.ringSide}>
                {(() => {
                  const diff = profile.calorieTarget - totals.calories;
                  return (
                    <>
                      <Text style={styles.sideValue}>{Math.abs(diff)}</Text>
                      <Text style={styles.sideLabel}>
                        {diff >= 0 ? 'kcal restantes' : 'kcal acima da meta'}
                      </Text>
                    </>
                  );
                })()}
              </View>
            </View>

            <MacroBar label="Proteína" value={totals.protein} goal={profile.macroTargets.proteinG} color={colors.accent} />
            <MacroBar label="Carboidrato" value={totals.carbs} goal={profile.macroTargets.carbsG} color={colors.warning} />
            <MacroBar label="Gordura" value={totals.fat} goal={profile.macroTargets.fatG} color={colors.danger} />
          </>
        ) : (
          <>
            <Text style={styles.totalCalories}>{totals.calories} kcal</Text>
            <Text style={styles.macroLine}>
              Proteína {totals.protein}g · Carbo {totals.carbs}g · Gordura {totals.fat}g
            </Text>
            <Button
              title="Definir meta"
              variant="outline"
              onPress={() => navigation.navigate('GoalSetup')}
              style={{ marginTop: spacing.sm }}
            />
          </>
        )}
      </Card>

      {dayLogs.length === 0 ? (
        <Text style={styles.emptyDay}>
          Nenhuma refeição neste dia. Adicione uma refeição ou aplique um cardápio.
        </Text>
      ) : null}

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
          onPress={() => navigation.navigate('MealPlanList', { applyDate: selectedDate })}
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

function MacroBar({ label, value, goal, color }) {
  const pct = goal ? Math.min(1, value / goal) : 0;
  const over = goal && value > goal;
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroTop}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroValue, over && { color: colors.danger }]}>
          {value}
          {goal ? ` / ${goal}` : ''} g
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
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
  emptyDay: { color: colors.textFaint, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  totalCalories: { color: colors.text, fontSize: 22, fontWeight: '800' },
  macroLine: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },

  ringRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  ringValue: { color: colors.text, fontSize: 26, fontWeight: '800' },
  ringUnit: { color: colors.textFaint, fontSize: 11, lineHeight: 13 },
  ringSide: { flex: 1, alignItems: 'center' },
  sideValue: { color: colors.text, fontSize: 24, fontWeight: '800' },
  sideLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2, textAlign: 'center' },

  macroRow: { marginTop: spacing.sm },
  macroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  macroValue: { color: colors.text, fontSize: 13, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },

  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  mealType: { color: colors.text, fontSize: 14, fontWeight: '700' },
  entryLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
