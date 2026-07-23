import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';
import { colors, spacing } from '../../theme/colors';

export default function MealPlanListScreen({ navigation }) {
  const { mealPlans } = useAppData();

  function countItems(plan) {
    return plan.meals.reduce((sum, m) => sum + m.items.length, 0);
  }

  return (
    <Screen>
      <Button
        title="+ Novo cardápio"
        onPress={() => navigation.navigate('MealPlanEditor')}
        style={{ marginBottom: spacing.md }}
      />

      {mealPlans.length === 0 ? (
        <Text style={styles.empty}>
          Nenhum cardápio ainda. Monte um plano do dia (café, almoço, jantar...) com os alimentos e
          reutilize quando quiser.
        </Text>
      ) : (
        mealPlans.map((plan) => (
          <Card key={plan.id} style={{ marginBottom: spacing.sm }}>
            <View style={styles.row}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('MealPlanDetail', { planId: plan.id })}
              >
                <Text style={styles.name}>{plan.name}</Text>
                <Text style={styles.meta}>
                  {plan.meals.length} refeição(ões) · {countItems(plan)} alimento(s)
                </Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate('MealPlanEditor', { planId: plan.id })}>
                <Ionicons name="create-outline" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  empty: { color: colors.textFaint, fontSize: 13, lineHeight: 19 },
});
