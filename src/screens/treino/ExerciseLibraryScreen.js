import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { MUSCLE_GROUPS, getEquipmentLabel } from '../../data/exerciseLibrary';
import { colors, spacing, radius } from '../../theme/colors';

export default function ExerciseLibraryScreen({ navigation }) {
  const { allExercises } = useAppData();
  const [groupFilter, setGroupFilter] = useState(null);

  const filtered = useMemo(
    () => (groupFilter ? allExercises.filter((e) => e.muscleGroup === groupFilter) : allExercises),
    [allExercises, groupFilter]
  );

  return (
    <Screen scroll={false} style={{ padding: spacing.md }}>
      <Button title="+ Novo exercício" onPress={() => navigation.navigate('ExerciseForm')} />
      <View style={[styles.filters, { marginTop: spacing.md }]}>
        <Chip label="Todos" selected={!groupFilter} onPress={() => setGroupFilter(null)} />
        {MUSCLE_GROUPS.map((g) => (
          <Chip
            key={g.key}
            label={g.label}
            selected={groupFilter === g.key}
            onPress={() => setGroupFilter(g.key)}
          />
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => item.isCustom && navigation.navigate('ExerciseForm', { exerciseId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{getEquipmentLabel(item.equipment)}</Text>
              {item.homeAlternative ? (
                <Text style={styles.itemAlt}>Alternativa casa: {item.homeAlternative}</Text>
              ) : null}
            </View>
            {item.isCustom ? (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Seu</Text>
              </View>
            ) : (
              <Ionicons name="lock-closed" size={16} color={colors.textFaint} />
            )}
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum exercício encontrado.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  itemMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  itemAlt: { color: colors.textFaint, fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  customBadge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  customBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
