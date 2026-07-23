import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';

export default function Screen({ children, scroll = true, style }) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Container
        style={[styles.container, style]}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },
});
