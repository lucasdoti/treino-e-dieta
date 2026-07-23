import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Chip from '../../components/Chip';
import TextField from '../../components/TextField';
import { useAppData } from '../../context/AppDataContext';
import { MUSCLE_GROUPS, getEquipmentLabel } from '../../data/exerciseLibrary';
import { normalizeText } from '../../utils/text';
import { colors, spacing, radius } from '../../theme/colors';

export default function ExercisePickerScreen({ navigation, route }) {
  const { allExercises } = useAppData();
  const onSelect = route.params?.onSelect;
  const [groupFilter, setGroupFilter] = useState(route.params?.initialGroup ?? null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return allExercises.filter((e) => {
      if (groupFilter && e.muscleGroup !== groupFilter) return false;
      if (q && !normalizeText(e.name).includes(q)) return false;
      return true;
    });
  }, [allExercises, groupFilter, query]);

  return (
    <Screen scroll={false} style={{ padding: spacing.md }}>
      <TextField
        containerStyle={{ marginBottom: spacing.sm }}
        placeholder="Buscar exercício..."
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.filters}>
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
            onPress={() => {
              onSelect?.(item);
              navigation.goBack();
            }}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>{getEquipmentLabel(item.equipment)}</Text>
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
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  itemMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
