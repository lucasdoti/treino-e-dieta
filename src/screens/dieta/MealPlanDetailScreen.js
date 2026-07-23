import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { notify } from '../../utils/confirm';
import { mealTypeLabel } from '../../data/mealTypes';
import { computeItemMacros, computeSubstitutions } from '../../utils/nutrition';
import { todayISO, formatDateBR } from '../../utils/date';
import { colors, spacing, radius } from '../../theme/colors';

export default function MealPlanDetailScreen({ navigation, route }) {
  const { mealPlans, allFoods, getFoodById, applyMealPlanToDate } = useAppData();
  const plan = mealPlans.find((p) => p.id === route.params?.planId);
  const [expandedKey, setExpandedKey] = useState(null);

  if (!plan) {
    return (
      <Screen>
        <Text style={styles.empty}>Cardápio não encontrado.</Text>
      </Screen>
    );
  }

  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  plan.meals.forEach((meal) =>
    meal.items.forEach((item) => {
      const m = computeItemMacros(getFoodById(item.foodId), item.grams);
      totals.calories += m.calories;
      totals.protein += m.protein;
      totals.carbs += m.carbs;
      totals.fat += m.fat;
    })
  );

  async function handleApplyToday() {
    const today = todayISO();
    await applyMealPlanToDate(plan, today);
    notify('Cardápio aplicado', `As refeições foram lançadas no diário de ${formatDateBR(today)}.`, () =>
      navigation.navigate('DietHome')
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{plan.name}</Text>
        <Pressable onPress={() => navigation.navigate('MealPlanEditor', { planId: plan.id })} hitSlop={8}>
          <Ionicons name="create-outline" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.totalCalories}>{totals.calories} kcal / dia</Text>
        <Text style={styles.totalMacros}>
          Proteína {totals.protein}g · Carbo {totals.carbs}g · Gordura {totals.fat}g
        </Text>
      </Card>

      {plan.meals.map((meal, mealIndex) => (
        <Card key={mealIndex} style={{ marginBottom: spacing.sm }}>
          <Text style={styles.mealType}>{mealTypeLabel(meal.mealType)}</Text>

          {meal.items.length === 0 ? (
            <Text style={styles.emptyItem}>Sem alimentos.</Text>
          ) : (
            meal.items.map((item, itemIndex) => {
              const food = getFoodById(item.foodId);
              const macros = computeItemMacros(food, item.grams);
              const key = `${mealIndex}-${itemIndex}`;
              const expanded = expandedKey === key;
              const subs = expanded ? computeSubstitutions(food, item.grams, allFoods) : [];
              return (
                <View key={itemIndex} style={styles.item}>
                  <Text style={styles.itemLine}>
                    {item.grams}g de {food?.name ?? 'Alimento'}
                  </Text>
                  <Text style={styles.itemMacros}>
                    {macros.calories} kcal · P{macros.protein} C{macros.carbs} G{macros.fat}
                  </Text>

                  <Pressable
                    style={styles.subToggle}
                    onPress={() => setExpandedKey(expanded ? null : key)}
                  >
                    <Ionicons
                      name={expanded ? 'chevron-up' : 'swap-horizontal'}
                      size={15}
                      color={colors.accent}
                    />
                    <Text style={styles.subToggleText}>
                      {expanded ? 'Ocultar substituições' : 'Ver substituições'}
                    </Text>
                  </Pressable>

                  {expanded ? (
                    subs.length === 0 ? (
                      <Text style={styles.noSub}>Sem substituições equivalentes para este item.</Text>
                    ) : (
                      <View style={styles.subList}>
                        {subs.map((sub) => (
                          <Text key={sub.food.id} style={styles.subLine}>
                            ou ~{sub.grams}g de {sub.food.name}{' '}
                            <Text style={styles.subMacro}>({sub.calories} kcal)</Text>
                          </Text>
                        ))}
                      </View>
                    )
                  ) : null}
                </View>
              );
            })
          )}
        </Card>
      ))}

      <Button
        title="Aplicar hoje no diário"
        onPress={handleApplyToday}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 },
  totalCalories: { color: colors.text, fontSize: 20, fontWeight: '800' },
  totalMacros: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  mealType: { color: colors.primary, fontSize: 14, fontWeight: '700', marginBottom: spacing.xs },
  emptyItem: { color: colors.textFaint, fontSize: 13 },
  item: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
  itemLine: { color: colors.text, fontSize: 14, fontWeight: '600' },
  itemMacros: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  subToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  subToggleText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  subList: {
    marginTop: spacing.xs,
    paddingLeft: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  noSub: { color: colors.textFaint, fontSize: 12, marginTop: spacing.xs },
  subLine: { color: colors.textMuted, fontSize: 13, marginTop: 3, borderRadius: radius.sm },
  subMacro: { color: colors.textFaint, fontSize: 12 },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
