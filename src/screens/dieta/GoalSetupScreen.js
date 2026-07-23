import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Chip from '../../components/Chip';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAppData } from '../../context/AppDataContext';
import { notify } from '../../utils/confirm';
import { ACTIVITY_LEVELS, GOALS, generateGoal } from '../../utils/calorieCalculator';
import { ageFromBirthDate } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

export default function GoalSetupScreen({ navigation }) {
  const { profile, updateProfile } = useAppData();
  const [mode, setMode] = useState(profile.calorieMode ?? 'manual');

  // manual mode fields
  const [calorieTarget, setCalorieTarget] = useState(String(profile.calorieTarget ?? ''));
  const [proteinG, setProteinG] = useState(String(profile.macroTargets?.proteinG ?? ''));
  const [carbsG, setCarbsG] = useState(String(profile.macroTargets?.carbsG ?? ''));
  const [fatG, setFatG] = useState(String(profile.macroTargets?.fatG ?? ''));

  // generated mode fields
  const [heightCm, setHeightCm] = useState(String(profile.heightCm ?? ''));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg ?? ''));
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? '');
  const [sex, setSex] = useState(profile.sex ?? 'masculino');
  const [activityKey, setActivityKey] = useState(profile.activityKey ?? 'moderado');
  const [goalKey, setGoalKey] = useState(profile.goalKey ?? 'manter');
  const [generatedPreview, setGeneratedPreview] = useState(null);

  function handleGenerate() {
    const age = ageFromBirthDate(birthDate);
    if (!heightCm || !weightKg || !age) {
      notify('Ops', 'Preencha altura, peso e data de nascimento (AAAA-MM-DD).');
      return;
    }
    const result = generateGoal({
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg.replace(',', '.')),
      age,
      sex,
      activityKey,
      goalKey,
    });
    setGeneratedPreview(result);
  }

  async function handleSaveGenerated() {
    await updateProfile({
      calorieMode: 'gerado',
      calorieTarget: generatedPreview.calories,
      macroTargets: {
        proteinG: generatedPreview.proteinG,
        carbsG: generatedPreview.carbsG,
        fatG: generatedPreview.fatG,
      },
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg.replace(',', '.')),
      birthDate,
      sex,
      activityKey,
      goalKey,
    });
    navigation.goBack();
  }

  async function handleSaveManual() {
    if (!calorieTarget) {
      notify('Ops', 'Informe a meta de calorias.');
      return;
    }
    await updateProfile({
      calorieMode: 'manual',
      calorieTarget: parseFloat(calorieTarget),
      macroTargets: {
        proteinG: parseFloat(proteinG) || 0,
        carbsG: parseFloat(carbsG) || 0,
        fatG: parseFloat(fatG) || 0,
      },
    });
    navigation.goBack();
  }

  return (
    <Screen>
      <View style={styles.chipRow}>
        <Chip label="Já sei minha meta" selected={mode === 'manual'} onPress={() => setMode('manual')} />
        <Chip label="Gerar pra mim" selected={mode === 'gerado'} onPress={() => setMode('gerado')} />
      </View>

      {mode === 'manual' ? (
        <View>
          <TextField
            label="Meta de calorias (kcal)"
            value={calorieTarget}
            onChangeText={setCalorieTarget}
            keyboardType="decimal-pad"
          />
          <TextField label="Proteína (g)" value={proteinG} onChangeText={setProteinG} keyboardType="decimal-pad" />
          <TextField label="Carboidrato (g)" value={carbsG} onChangeText={setCarbsG} keyboardType="decimal-pad" />
          <TextField label="Gordura (g)" value={fatG} onChangeText={setFatG} keyboardType="decimal-pad" />
          <Button title="Salvar meta" onPress={handleSaveManual} />
        </View>
      ) : (
        <View>
          <TextField label="Altura (cm)" value={heightCm} onChangeText={setHeightCm} keyboardType="decimal-pad" />
          <TextField label="Peso atual (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" />
          <TextField
            label="Data de nascimento (AAAA-MM-DD)"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="1995-06-20"
          />

          <Text style={styles.label}>Sexo</Text>
          <View style={styles.chipRow}>
            <Chip label="Masculino" selected={sex === 'masculino'} onPress={() => setSex('masculino')} />
            <Chip label="Feminino" selected={sex === 'feminino'} onPress={() => setSex('feminino')} />
          </View>

          <Text style={styles.label}>Nível de atividade</Text>
          <View style={styles.chipRow}>
            {ACTIVITY_LEVELS.map((a) => (
              <Chip key={a.key} label={a.label} selected={activityKey === a.key} onPress={() => setActivityKey(a.key)} />
            ))}
          </View>

          <Text style={styles.label}>Objetivo</Text>
          <View style={styles.chipRow}>
            {GOALS.map((g) => (
              <Chip key={g.key} label={g.label} selected={goalKey === g.key} onPress={() => setGoalKey(g.key)} />
            ))}
          </View>

          <Button title="Calcular" variant="outline" onPress={handleGenerate} style={{ marginBottom: spacing.md }} />

          {generatedPreview ? (
            <Card style={{ marginBottom: spacing.md }}>
              <Text style={styles.previewTitle}>Meta sugerida</Text>
              <Text style={styles.previewLine}>{generatedPreview.calories} kcal/dia</Text>
              <Text style={styles.previewLine}>
                Proteína {generatedPreview.proteinG}g · Carbo {generatedPreview.carbsG}g · Gordura{' '}
                {generatedPreview.fatG}g
              </Text>
              <Button title="Usar essa meta" onPress={handleSaveGenerated} style={{ marginTop: spacing.sm }} />
            </Card>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  label: { color: colors.textMuted, marginBottom: spacing.sm, fontSize: 13, fontWeight: '600' },
  previewTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing.xs },
  previewLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
