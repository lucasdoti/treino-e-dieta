import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { colors, spacing, radius } from '../../theme/colors';

export default function FoodCatalogScreen({ navigation, route }) {
  const { foods } = useAppData();
  const onSelect = route.params?.onSelect;

  return (
    <Screen scroll={false} style={{ padding: spacing.md }}>
      <Button title="+ Novo alimento" onPress={() => navigation.navigate('FoodForm')} />
      <FlatList
        style={{ marginTop: spacing.md }}
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => {
              if (onSelect) {
                onSelect(item);
                navigation.goBack();
              } else {
                navigation.navigate('FoodForm', { foodId: item.id });
              }
            }}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>
              {item.caloriesPer100} kcal / 100g · P{item.proteinPer100} C{item.carbsPer100} G{item.fatPer100}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum alimento cadastrado ainda. Adicione o primeiro!</Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
