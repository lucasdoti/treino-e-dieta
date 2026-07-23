import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAppData } from '../../context/AppDataContext';
import { getFoodCategoryLabel } from '../../data/foodLibrary';
import { colors, spacing, radius } from '../../theme/colors';

// Remove acentos para busca "sem frescura"
function normalize(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export default function FoodCatalogScreen({ navigation, route }) {
  const { allFoods } = useAppData();
  const onSelect = route.params?.onSelect;
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return allFoods;
    return allFoods.filter((f) => normalize(f.name).includes(q));
  }, [allFoods, query]);

  function toggle(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <Screen scroll={false} style={{ padding: spacing.md }}>
      <Button title="+ Novo alimento" onPress={() => navigation.navigate('FoodForm')} />
      <TextField
        containerStyle={{ marginTop: spacing.md, marginBottom: spacing.sm }}
        placeholder="Buscar alimento..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <View style={styles.item}>
              <Pressable style={styles.row} onPress={() => toggle(item.id)}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>

              {expanded ? (
                <View style={styles.detail}>
                  {item.category ? (
                    <Text style={styles.category}>{getFoodCategoryLabel(item.category)}</Text>
                  ) : null}
                  <Text style={styles.detailHint}>Valores por 100g</Text>
                  <MacroRow label="Calorias" value={`${item.caloriesPer100} kcal`} />
                  <MacroRow label="Proteína" value={`${item.proteinPer100} g`} />
                  <MacroRow label="Carboidratos" value={`${item.carbsPer100} g`} />
                  <MacroRow label="Gordura" value={`${item.fatPer100} g`} />

                  {onSelect ? (
                    <Button
                      title="Selecionar este alimento"
                      onPress={() => {
                        onSelect(item);
                        navigation.goBack();
                      }}
                      style={{ marginTop: spacing.sm }}
                    />
                  ) : !item.isLibrary ? (
                    <Button
                      title="Editar"
                      variant="outline"
                      onPress={() => navigation.navigate('FoodForm', { foodId: item.id })}
                      style={{ marginTop: spacing.sm }}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum alimento encontrado.</Text>
        }
      />
    </Screen>
  );
}

function MacroRow({ label, value }) {
  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  itemName: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  detail: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  category: { color: colors.primary, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  detailHint: { color: colors.textFaint, fontSize: 11, marginBottom: spacing.xs },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  macroLabel: { color: colors.textMuted, fontSize: 13 },
  macroValue: { color: colors.text, fontSize: 13, fontWeight: '600' },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
