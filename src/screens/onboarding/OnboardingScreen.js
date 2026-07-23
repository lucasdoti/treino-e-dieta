import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { useAppData } from '../../context/AppDataContext';
import { GOALS } from '../../utils/calorieCalculator';
import { colors, spacing, radius } from '../../theme/colors';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAppData();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goalKey, setGoalKey] = useState('manter');
  const [sex, setSex] = useState('masculino');
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    await completeOnboarding({ name: name.trim(), goalKey, sex });
    // Ao marcar onboarded=true, o app troca para a navegação principal.
  }

  async function skip() {
    setSaving(true);
    await completeOnboarding({});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 0 ? (
          <View style={styles.center}>
            <View style={styles.logo}>
              <Ionicons name="barbell" size={34} color={colors.background} />
            </View>
            <Text style={styles.title}>Bem-vindo ao Treino & Dieta</Text>
            <Text style={styles.subtitle}>
              Monte seus treinos, acompanhe sua dieta e veja sua evolução — tudo salvo na sua conta.
            </Text>
            <Button title="Vamos começar" onPress={() => setStep(1)} style={{ marginTop: spacing.lg, alignSelf: 'stretch' }} />
            <Pressable onPress={skip} disabled={saving} style={{ marginTop: spacing.md }}>
              <Text style={styles.skip}>Pular por enquanto</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 1 ? (
          <View>
            <Text style={styles.stepHint}>Passo 1 de 2</Text>
            <Text style={styles.title}>Sobre você</Text>

            <TextField
              label="Como quer ser chamado?"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              containerStyle={{ marginTop: spacing.md }}
            />

            <Text style={styles.label}>Seu objetivo</Text>
            <View style={styles.chipRow}>
              {GOALS.map((g) => (
                <Chip key={g.key} label={g.label} selected={goalKey === g.key} onPress={() => setGoalKey(g.key)} />
              ))}
            </View>

            <Text style={styles.label}>Sexo</Text>
            <View style={styles.chipRow}>
              <Chip label="Masculino" selected={sex === 'masculino'} onPress={() => setSex('masculino')} />
              <Chip label="Feminino" selected={sex === 'feminino'} onPress={() => setSex('feminino')} />
            </View>

            <Button title="Continuar" onPress={() => setStep(2)} style={{ marginTop: spacing.lg }} />
            <Pressable onPress={() => setStep(0)} style={{ marginTop: spacing.md, alignSelf: 'center' }}>
              <Text style={styles.skip}>Voltar</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text style={styles.stepHint}>Passo 2 de 2</Text>
            <Text style={styles.title}>{name.trim() ? `Tudo pronto, ${name.trim()}!` : 'Tudo pronto!'}</Text>
            <Text style={styles.subtitle}>Um resumo rápido do que dá pra fazer:</Text>

            <Tip icon="barbell" text="Crie ou gere um treino na aba Treino e lance suas séries." />
            <Tip icon="restaurant" text="Monte sua dieta e cardápios na aba Dieta, com metas de calorias e macros." />
            <Tip icon="stats-chart" text="Acompanhe peso, cargas e constância na aba Progresso e no Perfil." />

            <Button
              title="Ir para o app"
              onPress={finish}
              loading={saving}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Tip({ icon, text }) {
  return (
    <View style={styles.tip}>
      <View style={styles.tipIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  center: { alignItems: 'center' },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  stepHint: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: spacing.xs },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginTop: spacing.md, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  skip: { color: colors.textMuted, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { color: colors.textMuted, fontSize: 14, flex: 1, lineHeight: 19 },
});
