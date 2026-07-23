import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { formatDateBR } from '../../utils/date';
import { colors, spacing } from '../../theme/colors';

export default function WorkoutHomeScreen({ navigation }) {
  const { workoutTemplates, workoutLogs } = useAppData();

  const recentLogs = [...workoutLogs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  return (
    <Screen>
      <View style={styles.actionsRow}>
        <Button
          title="Gerar treino"
          variant="outline"
          onPress={() => navigation.navigate('WorkoutGenerator')}
          style={styles.actionBtn}
        />
        <Button
          title="Exercícios"
          variant="outline"
          onPress={() => navigation.navigate('ExerciseLibrary')}
          style={styles.actionBtn}
        />
      </View>

      <Text style={styles.sectionTitle}>Meus treinos</Text>
      {workoutTemplates.length === 0 ? (
        <Text style={styles.empty}>Nenhum treino cadastrado ainda.</Text>
      ) : (
        workoutTemplates.map((template) => (
          <Card key={template.id} style={{ marginBottom: spacing.sm }}>
            <View style={styles.templateRow}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('WorkoutSession', { templateId: template.id })}
              >
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateMeta}>
                  {template.exerciseEntries.length} exercício(s)
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('WorkoutTemplateEditor', { templateId: template.id })}
              >
                <Ionicons name="create-outline" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </Card>
        ))
      )}

      <Button
        title="+ Novo treino manual"
        variant="outline"
        onPress={() => navigation.navigate('WorkoutTemplateEditor')}
        style={{ marginTop: spacing.sm, marginBottom: spacing.md }}
      />

      <Button
        title="Lançar exercício avulso"
        onPress={() => navigation.navigate('WorkoutSession', {})}
        style={{ marginBottom: spacing.lg }}
      />

      <Text style={styles.sectionTitle}>Últimos treinos</Text>
      {recentLogs.length === 0 ? (
        <Text style={styles.empty}>Nenhum treino lançado ainda.</Text>
      ) : (
        recentLogs.map((log) => (
          <Card key={log.id} style={{ marginBottom: spacing.sm }}>
            <Text style={styles.logDate}>{formatDateBR(log.date)}</Text>
            <Text style={styles.templateName}>{log.templateName}</Text>
            <Text style={styles.templateMeta}>{log.entries.length} exercício(s) lançado(s)</Text>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn: { flex: 1 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  templateRow: { flexDirection: 'row', alignItems: 'center' },
  templateName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  templateMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  logDate: { color: colors.textFaint, fontSize: 11 },
  empty: { color: colors.textFaint, fontSize: 13, marginBottom: spacing.md },
});
