import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { confirmAction, notify } from '../../utils/confirm';
import { colors, spacing } from '../../theme/colors';

const FREQUENCIES = [
  { key: 'diario', label: 'Todos os dias' },
  { key: 'semanal', label: 'Uma vez por semana' },
  { key: 'mensal', label: 'Uma vez por mês' },
];

export default function ProfileSettingsScreen({ navigation }) {
  const { profile, updateProfile } = useAppData();
  const { configured, user, signOut } = useAuth();
  const [name, setName] = useState(profile.name ?? '');

  function handleSignOut() {
    confirmAction({
      title: 'Sair da conta',
      message: 'Você quer sair? Seus dados estão salvos na nuvem e voltam ao entrar de novo.',
      confirmLabel: 'Sair',
      destructive: true,
      onConfirm: () => signOut(),
    });
  }
  const [incrementUpperKg, setIncrementUpperKg] = useState(String(profile.incrementUpperKg));
  const [incrementLowerKg, setIncrementLowerKg] = useState(String(profile.incrementLowerKg));
  const [restSeconds, setRestSeconds] = useState(String(profile.restSeconds ?? 90));
  const [waterGoalMl, setWaterGoalMl] = useState(String(profile.waterGoalMl ?? 2500));

  async function handleSaveName() {
    await updateProfile({ name: name.trim() });
    notify('Pronto', 'Nome salvo.');
  }

  async function handleSaveIncrements() {
    await updateProfile({
      incrementUpperKg: parseFloat(incrementUpperKg.replace(',', '.')) || profile.incrementUpperKg,
      incrementLowerKg: parseFloat(incrementLowerKg.replace(',', '.')) || profile.incrementLowerKg,
    });
    notify('Pronto', 'Incrementos salvos.');
  }

  async function handleSaveRest() {
    const value = parseInt(restSeconds, 10);
    await updateProfile({ restSeconds: value > 0 ? value : 90 });
    notify('Pronto', 'Descanso padrão salvo.');
  }

  async function handleSaveWater() {
    const value = parseInt(waterGoalMl, 10);
    await updateProfile({ waterGoalMl: value > 0 ? value : 2500 });
    notify('Pronto', 'Meta de água salva.');
  }

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Seu nome</Text>
        <TextField value={name} onChangeText={setName} placeholder="Como quer ser chamado" />
        <Button title="Salvar nome" onPress={handleSaveName} />
      </Card>

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

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.cardTitle}>Descanso entre séries</Text>
        <Text style={styles.helper}>
          Tempo que o cronômetro usa por padrão ao iniciar um descanso no treino.
        </Text>
        <TextField
          label="Segundos"
          value={restSeconds}
          onChangeText={setRestSeconds}
          keyboardType="number-pad"
        />
        <Button title="Salvar" onPress={handleSaveRest} />
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.cardTitle}>Meta de água</Text>
        <Text style={styles.helper}>Quantidade diária que aparece na barra de água da Dieta.</Text>
        <TextField
          label="Mililitros por dia (ml)"
          value={waterGoalMl}
          onChangeText={setWaterGoalMl}
          keyboardType="number-pad"
        />
        <Button title="Salvar" onPress={handleSaveWater} />
      </Card>

      {configured && user ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>Conta</Text>
          <Text style={styles.summaryLine}>{user.email}</Text>
          <Text style={styles.helper}>Seus dados sincronizam automaticamente na nuvem.</Text>
          <Button title="Sair da conta" variant="danger" onPress={handleSignOut} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing.sm },
  summaryLine: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  helper: { color: colors.textFaint, fontSize: 12, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
