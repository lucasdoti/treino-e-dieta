import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAppData } from '../../context/AppDataContext';
import { confirmAction, notify } from '../../utils/confirm';
import { MEAL_TYPES } from '../../data/mealTypes';
import { computeItemMacros } from '../../utils/nutrition';
import { colors, spacing } from '../../theme/colors';

export default function MealPlanEditorScreen({ navigation, route }) {
  const { mealPlans, getFoodById, saveMealPlan, deleteMealPlan } = useAppData();
  const editing = mealPlans.find((p) => p.id === route.params?.planId);

  const [name, setName] = useState(editing?.name ?? '');
  const [meals, setMeals] = useState(editing?.meals ?? [{ mealType: 'cafe_da_manha', items: [] }]);

  function addMeal() {
    setMeals((prev) => [...prev, { mealType: 'almoco', items: [] }]);
  }

  function removeMeal(mealIndex) {
    setMeals((prev) => prev.filter((_, i) => i !== mealIndex));
  }

  function setMealType(mealIndex, mealType) {
    setMeals((prev) => prev.map((m, i) => (i === mealIndex ? { ...m, mealType } : m)));
  }

  function addFoodToMeal(mealIndex, food) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIndex
          ? { ...m, items: [...m.items, { foodId: food.id, grams: String(food.defaultPortionGrams ?? 100) }] }
          : m
      )
    );
  }

  function updateItemGrams(mealIndex, itemIndex, grams) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIndex
          ? { ...m, items: m.items.map((it, j) => (j === itemIndex ? { ...it, grams } : it)) }
          : m
      )
    );
  }

  function removeItem(mealIndex, itemIndex) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIndex ? { ...m, items: m.items.filter((_, j) => j !== itemIndex) } : m
      )
    );
  }

  async function handleSave() {
    if (!name.trim()) {
      notify('Ops', 'Dê um nome para o cardápio.');
      return;
    }
    const totalItems = meals.reduce((sum, m) => sum + m.items.length, 0);
    if (totalItems === 0) {
      notify('Ops', 'Adicione ao menos um alimento em alguma refeição.');
      return;
    }
    await saveMealPlan({ id: editing?.id, name: name.trim(), meals });
    navigation.goBack();
  }

  function handleDelete() {
    confirmAction({
      title: 'Excluir cardápio',
      message: `Remover "${editing.name}"?`,
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        await deleteMealPlan(editing.id);
        navigation.goBack();
      },
    });
  }

  return (
    <Screen>
      <TextField label="Nome do cardápio" value={name} onChangeText={setName} placeholder="Ex: Dieta cutting" />

      {meals.map((meal, mealIndex) => (
        <Card key={mealIndex} style={{ marginBottom: spacing.md }}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>Refeição {mealIndex + 1}</Text>
            <Pressable onPress={() => removeMeal(mealIndex)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          </View>

          <View style={styles.chipRow}>
            {MEAL_TYPES.map((m) => (
              <Chip
                key={m.key}
                label={m.label}
                selected={meal.mealType === m.key}
                onPress={() => setMealType(mealIndex, m.key)}
              />
            ))}
          </View>

          {meal.items.map((item, itemIndex) => {
            const food = getFoodById(item.foodId);
            const macros = computeItemMacros(food, item.grams);
            return (
              <View key={itemIndex} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{food?.name ?? 'Alimento'}</Text>
                  <Pressable onPress={() => removeItem(mealIndex, itemIndex)} hitSlop={8}>
                    <Ionicons name="close" size={18} color={colors.textFaint} />
                  </Pressable>
                </View>
                <TextField
                  containerStyle={{ marginBottom: spacing.xs }}
                  label="Quantidade (g)"
                  keyboardType="decimal-pad"
                  value={item.grams}
                  onChangeText={(v) => updateItemGrams(mealIndex, itemIndex, v)}
                />
                <Text style={styles.itemMacros}>
                  {macros.calories} kcal · P{macros.protein} C{macros.carbs} G{macros.fat}
                </Text>
              </View>
            );
          })}

          <Button
            title="+ Adicionar alimento"
            variant="outline"
            onPress={() =>
              navigation.navigate('FoodCatalog', {
                onSelect: (food) => addFoodToMeal(mealIndex, food),
              })
            }
            style={{ marginTop: spacing.sm }}
          />
        </Card>
      ))}

      <Button
        title="+ Adicionar refeição"
        variant="outline"
        onPress={addMeal}
        style={{ marginBottom: spacing.md }}
      />

      <Button title="Salvar cardápio" onPress={handleSave} />
      {editing ? (
        <Button
          title="Excluir cardápio"
          variant="danger"
          onPress={handleDelete}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  mealTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  item: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  itemMacros: { color: colors.textMuted, fontSize: 12 },
});
