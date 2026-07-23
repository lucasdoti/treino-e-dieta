import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { colors, spacing } from '../../theme/colors';

const FREQUENCIES = [
  { key: 'diario', label: 'Todos os dias' },
  { key: 'semanal', label: 'Uma vez por semana' },
  { key: 'mensal', label: 'Uma vez por mês' },
];

export default function PerfilScreen({ navigation }) {
  const { profile, updateProfile } = useAppData();
  const [incrementUpperKg, setIncrementUpperKg] = useState(String(profile.incrementUpperKg));
  const [incrementLowerKg, setIncrementLowerKg] = useState(String(profile.incrementLowerKg));

  async function handleSaveIncrements() {
    await updateProfile({
      incrementUpperKg: parseFloat(incrementUpperKg.replace(',', '.')) || profile.incrementUpperKg,
      incrementLowerKg: parseFloat(incrementLowerKg.replace(',', '.')) || profile.incrementLowerKg,
    });
  }

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Dados e meta calórica</Text>
        <Text style={styles.summaryLine}>
          {profile.heightCm ? `${profile.heightCm}cm · ${profile.weightKg}kg` : 'Ainda não preenchido'}
        </Text>
        <Text style={styles.summaryLine}>
          Meta: {profile.calorieTarget ? `${profile.calorieTarget} kcal/dia` : 'não definida'}
        </Text>
        <Button
          title="Editar dados e meta"
          variant="outline"
          onPress={() => navigation.navigate('Dieta', { screen: 'GoalSetup' })}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Frequência de registro de peso</Text>
        <View style={styles.chipRow}>
          {FREQUENCIES.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              selected={profile.weightFrequency === f.key}
              onPress={() => updateProfile({ weightFrequency: f.key })}
            />
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Incremento de progressão</Text>
        <Text style={styles.helper}>
          Quanto o app sugere subir de carga quando você bate o topo da faixa de reps.
        </Text>
        <TextField
          label="Superior (kg)"
          value={incrementUpperKg}
          onChangeText={setIncrementUpperKg}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Inferior (kg)"
          value={incrementLowerKg}
          onChangeText={setIncrementLowerKg}
          keyboardType="decimal-pad"
        />
        <Button title="Salvar" onPress={handleSaveIncrements} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing.sm },
  summaryLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  helper: { color: colors.textFaint, fontSize: 12, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
