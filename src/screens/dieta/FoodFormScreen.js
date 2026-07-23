import React, { useState } from 'react';
import { Alert } from 'react-native';
import Screen from '../../components/Screen';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { confirmAction } from '../../utils/confirm';
import { spacing } from '../../theme/colors';

export default function FoodFormScreen({ navigation, route }) {
  const { foods, saveFood, deleteFood } = useAppData();
  const editing = foods.find((f) => f.id === route.params?.foodId);

  const [name, setName] = useState(editing?.name ?? '');
  const [caloriesPer100, setCaloriesPer100] = useState(String(editing?.caloriesPer100 ?? ''));
  const [proteinPer100, setProteinPer100] = useState(String(editing?.proteinPer100 ?? ''));
  const [carbsPer100, setCarbsPer100] = useState(String(editing?.carbsPer100 ?? ''));
  const [fatPer100, setFatPer100] = useState(String(editing?.fatPer100 ?? ''));
  const [defaultPortionGrams, setDefaultPortionGrams] = useState(
    String(editing?.defaultPortionGrams ?? 100)
  );

  async function handleSave() {
    if (!name.trim() || !caloriesPer100) {
      Alert.alert('Ops', 'Informe ao menos nome e calorias por 100g.');
      return;
    }
    await saveFood({
      id: editing?.id,
      name: name.trim(),
      caloriesPer100: parseFloat(caloriesPer100.replace(',', '.')) || 0,
      proteinPer100: parseFloat(proteinPer100.replace(',', '.')) || 0,
      carbsPer100: parseFloat(carbsPer100.replace(',', '.')) || 0,
      fatPer100: parseFloat(fatPer100.replace(',', '.')) || 0,
      defaultPortionGrams: parseFloat(defaultPortionGrams.replace(',', '.')) || 100,
    });
    navigation.goBack();
  }

  function handleDelete() {
    confirmAction({
      title: 'Excluir alimento',
      message: `Remover "${editing.name}"?`,
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        await deleteFood(editing.id);
        navigation.goBack();
      },
    });
  }

  return (
    <Screen>
      <TextField label="Nome" value={name} onChangeText={setName} placeholder="Ex: Arroz branco cozido" />
      <TextField
        label="Calorias por 100g (kcal)"
        value={caloriesPer100}
        onChangeText={setCaloriesPer100}
        keyboardType="decimal-pad"
      />
      <TextField
        label="Proteína por 100g (g)"
        value={proteinPer100}
        onChangeText={setProteinPer100}
        keyboardType="decimal-pad"
      />
      <TextField
        label="Carboidrato por 100g (g)"
        value={carbsPer100}
        onChangeText={setCarbsPer100}
        keyboardType="decimal-pad"
      />
      <TextField
        label="Gordura por 100g (g)"
        value={fatPer100}
        onChangeText={setFatPer100}
        keyboardType="decimal-pad"
      />
      <TextField
        label="Porção padrão (g)"
        value={defaultPortionGrams}
        onChangeText={setDefaultPortionGrams}
        keyboardType="decimal-pad"
      />

      <Button title="Salvar" onPress={handleSave} style={{ marginTop: spacing.md }} />
      {editing ? (
        <Button title="Excluir" variant="danger" onPress={handleDelete} style={{ marginTop: spacing.sm }} />
      ) : null}
    </Screen>
  );
}
