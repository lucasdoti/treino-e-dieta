import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/Screen';
import TextField from '../../components/TextField';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { confirmAction } from '../../utils/confirm';
import { MUSCLE_GROUPS, EQUIPMENT } from '../../data/exerciseLibrary';
import { colors, spacing } from '../../theme/colors';

export default function ExerciseFormScreen({ navigation, route }) {
  const { customExercises, addCustomExercise, updateCustomExercise, deleteCustomExercise } =
    useAppData();
  const editing = customExercises.find((e) => e.id === route.params?.exerciseId);

  const [name, setName] = useState(editing?.name ?? '');
  const [muscleGroup, setMuscleGroup] = useState(editing?.muscleGroup ?? 'peito');
  const [equipment, setEquipment] = useState(editing?.equipment ?? 'peso_corporal');

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Ops', 'Dê um nome para o exercício.');
      return;
    }
    if (editing) {
      await updateCustomExercise(editing.id, { name: name.trim(), muscleGroup, equipment });
    } else {
      await addCustomExercise({ name: name.trim(), muscleGroup, equipment });
    }
    navigation.goBack();
  }

  function handleDelete() {
    confirmAction({
      title: 'Excluir exercício',
      message: `Remover "${editing.name}"?`,
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        await deleteCustomExercise(editing.id);
        navigation.goBack();
      },
    });
  }

  return (
    <Screen>
      <TextField label="Nome" value={name} onChangeText={setName} placeholder="Ex: Supino reto" />

      <Text style={styles.label}>Grupo muscular</Text>
      <View style={styles.chipRow}>
        {MUSCLE_GROUPS.map((g) => (
          <Chip
            key={g.key}
            label={g.label}
            selected={muscleGroup === g.key}
            onPress={() => setMuscleGroup(g.key)}
          />
        ))}
      </View>

      <Text style={styles.label}>Equipamento</Text>
      <View style={styles.chipRow}>
        {EQUIPMENT.map((e) => (
          <Chip
            key={e.key}
            label={e.label}
            selected={equipment === e.key}
            onPress={() => setEquipment(e.key)}
          />
        ))}
      </View>

      <Button title="Salvar" onPress={handleSave} style={{ marginTop: spacing.md }} />
      {editing ? (
        <Button title="Excluir" variant="danger" onPress={handleDelete} style={{ marginTop: spacing.sm }} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textMuted, marginBottom: spacing.sm, fontSize: 13, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
});
