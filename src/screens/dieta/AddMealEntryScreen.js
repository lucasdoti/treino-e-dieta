import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAppData } from '../../context/AppDataContext';
import { notify } from '../../utils/confirm';
import { todayISO } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

const MEAL_TYPES = [
  { key: 'cafe_da_manha', label: 'Café da manhã' },
  { key: 'almoco', label: 'Almoço' },
  { key: 'lanche', label: 'Lanche' },
  { key: 'jantar', label: 'Jantar' },
  { key: 'ceia', label: 'Ceia' },
  { key: 'outro', label: 'Outro' },
];

export default function AddMealEntryScreen({ navigation, route }) {
  const { foods, addMealLog } = useAppData();
  const date = route.params?.date ?? todayISO();
  const [mealType, setMealType] = useState('almoco');
  const [entries, setEntries] = useState([]);

  function addFoodEntry(food) {
    setEntries((prev) => [...prev, { foodId: food.id, grams: String(food.defaultPortionGrams ?? 100) }]);
  }

  function updateGrams(index, grams) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, grams } : e)));
  }

  function removeEntry(index) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function computeEntryMacros(entry) {
    const food = foods.find((f) => f.id === entry.foodId);
    const grams = parseFloat(String(entry.grams).replace(',', '.')) || 0;
    const factor = grams / 100;
    return {
      food,
      grams,
      calories: Math.round((food?.caloriesPer100 ?? 0) * factor),
      protein: Math.round((food?.proteinPer100 ?? 0) * factor),
      carbs: Math.round((food?.carbsPer100 ?? 0) * factor),
      fat: Math.round((food?.fatPer100 ?? 0) * factor),
    };
  }

  const computed = entries.map(computeEntryMacros);
  const totalCalories = computed.reduce((sum, c) => sum + c.calories, 0);

  async function handleSave() {
    if (entries.length === 0) {
      notify('Ops', 'Adicione ao menos um alimento.');
      return;
    }
    const finalEntries = computed.map((c) => ({
      foodId: c.food.id,
      foodName: c.food.name,
      grams: c.grams,
      calories: c.calories,
      protein: c.protein,
      carbs: c.carbs,
      fat: c.fat,
    }));
    await addMealLog({ date, mealType, entries: finalEntries });
    navigation.goBack();
  }

  return (
    <Screen>
      <View style={styles.chipRow}>
        {MEAL_TYPES.map((m) => (
          <Chip key={m.key} label={m.label} selected={mealType === m.key} onPress={() => setMealType(m.key)} />
        ))}
      </View>

      {computed.map((c, index) => (
        <Card key={index} style={{ marginBottom: spacing.sm }}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryName}>{c.food?.name ?? 'Alimento'}</Text>
            <Pressable onPress={() => removeEntry(index)}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          </View>
          <TextField
            containerStyle={{ marginTop: spacing.sm, marginBottom: 0 }}
            label="Quantidade (g)"
            keyboardType="decimal-pad"
            value={entries[index].grams}
            onChangeText={(v) => updateGrams(index, v)}
          />
          <Text style={styles.entryMacros}>
            {c.calories} kcal · P{c.protein} C{c.carbs} G{c.fat}
          </Text>
        </Card>
      ))}

      <Button
        title="+ Adicionar alimento"
        variant="outline"
        onPress={() => navigation.navigate('FoodCatalog', { onSelect: addFoodEntry })}
        style={{ marginBottom: spacing.md }}
      />

      {entries.length > 0 ? (
        <Text style={styles.total}>Total: {totalCalories} kcal</Text>
      ) : null}

      <Button title="Salvar refeição" onPress={handleSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryName: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  entryMacros: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  total: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.md, textAlign: 'right' },
});
