import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../theme/colors';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  function translateError(message) {
    const m = (message || '').toLowerCase();
    if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
    if (m.includes('already registered')) return 'Esse e-mail já tem conta. Faça login.';
    if (m.includes('password')) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (m.includes('email')) return 'Informe um e-mail válido.';
    if (m.includes('network') || m.includes('fetch')) return 'Sem conexão. Tente de novo.';
    return message || 'Algo deu errado. Tente novamente.';
  }

  async function handleSubmit() {
    setError(null);
    setInfo(null);
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const { needsEmailConfirmation } = await signUp(email, password);
        if (needsEmailConfirmation) {
          setInfo('Conta criada! Confirme pelo link enviado no seu e-mail e depois faça login.');
          setMode('login');
        }
      }
    } catch (e) {
      setError(translateError(e?.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="barbell" size={30} color={colors.background} />
            </View>
            <Text style={styles.appName}>Treino & Dieta</Text>
            <Text style={styles.tagline}>Seus treinos e dieta, salvos na sua conta.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{isLogin ? 'Entrar' : 'Criar conta'}</Text>

            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {info ? <Text style={styles.info}>{info}</Text> : null}

            <Button
              title={isLogin ? 'Entrar' : 'Criar conta'}
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: spacing.sm }}
            />

            <Text style={styles.switchText}>
              {isLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
              <Text
                style={styles.switchLink}
                onPress={() => {
                  setError(null);
                  setInfo(null);
                  setMode(isLogin ? 'signup' : 'login');
                }}
              >
                {isLogin ? 'Criar agora' : 'Entrar'}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: { color: colors.text, fontSize: 24, fontWeight: '800' },
  tagline: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing.xs },
  info: { color: colors.primary, fontSize: 13, marginTop: spacing.xs },
  switchText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: spacing.md },
  switchLink: { color: colors.primary, fontWeight: '700' },
});
