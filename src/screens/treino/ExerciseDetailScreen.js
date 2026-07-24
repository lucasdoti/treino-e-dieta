import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { getExerciseInstructions } from '../../data/exerciseInstructions';
import { getMuscleGroupLabel, getEquipmentLabel } from '../../data/exerciseLibrary';
import { colors, spacing, radius } from '../../theme/colors';

export default function ExerciseDetailScreen({ navigation, route }) {
  const { getExerciseById } = useAppData();
  const exercise = getExerciseById(route.params?.exerciseId);

  if (!exercise) {
    return (
      <Screen>
        <Text style={styles.empty}>Exercício não encontrado.</Text>
      </Screen>
    );
  }

  const info = getExerciseInstructions(exercise.id);

  function openVideo() {
    const query = encodeURIComponent(`${exercise.name} execução como fazer`);
    Linking.openURL(`https://www.youtube.com/results?search_query=${query}`);
  }

  return (
    <Screen>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.meta}>
        {getMuscleGroupLabel(exercise.muscleGroup)} · {getEquipmentLabel(exercise.equipment)}
      </Text>

      <Button
        title="Ver vídeo de demonstração"
        onPress={openVideo}
        style={{ marginTop: spacing.md }}
      />
      <Text style={styles.videoHint}>Abre uma busca de vídeos do exercício no navegador.</Text>

      {info?.steps?.length ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>Como fazer</Text>
          {info.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          {info.tip ? (
            <View style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={16} color={colors.warning} />
              <Text style={styles.tipText}>{info.tip}</Text>
            </View>
          ) : null}
        </Card>
      ) : (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.noInfo}>
            Ainda não há um passo a passo escrito para este exercício. Toque em "Ver vídeo" para uma
            demonstração.
          </Text>
        </Card>
      )}

      {exercise.homeAlternative ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>Alternativa em casa</Text>
          <Text style={styles.altText}>{exercise.homeAlternative}</Text>
        </Card>
      ) : null}

      {exercise.isCustom ? (
        <Button
          title="Editar exercício"
          variant="outline"
          onPress={() => navigation.navigate('ExerciseForm', { exerciseId: exercise.id })}
          style={{ marginTop: spacing.md }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  meta: { color: colors.primary, fontSize: 13, fontWeight: '600', marginTop: 4 },
  videoHint: { color: colors.textFaint, fontSize: 11, marginTop: spacing.xs, textAlign: 'center' },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: spacing.sm },
  stepRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  stepText: { color: colors.textMuted, fontSize: 14, flex: 1, lineHeight: 20 },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tipText: { color: colors.textMuted, fontSize: 13, flex: 1, lineHeight: 18, fontStyle: 'italic' },
  altText: { color: colors.textMuted, fontSize: 14 },
  noInfo: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
