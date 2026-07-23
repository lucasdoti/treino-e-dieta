import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppDataProvider } from './src/context/AppDataContext';
import RootNavigator from './src/navigation/RootNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';
import { colors } from './src/theme/colors';

// No web/PWA os safe-area insets (env(safe-area-inset-*)) só passam a valer
// com viewport-fit=cover — sem isso a barra inferior fica cortada em celulares
// com barra de gestos. O Expo web não injeta isso por padrão.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    document.head.appendChild(meta);
  }
  meta.setAttribute(
    'content',
    'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
  );

  // PWA: manifest, ícone do app (halter no verde) e metas para "adicionar à tela
  // inicial" abrir como app. Injetado em runtime porque o export do Expo gera o
  // index.html a cada build.
  const upsertLink = (rel, href, attrs = {}) => {
    const selector = `link[rel="${rel}"]`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  };
  const upsertMeta = (name, content) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  upsertLink('manifest', '/manifest.json');
  upsertLink('apple-touch-icon', '/apple-touch-icon.png');
  upsertMeta('theme-color', '#4ADE80');
  upsertMeta('mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  upsertMeta('apple-mobile-web-app-title', 'Treino & Dieta');
}

// Decide o que mostrar: carregando a sessão, tela de login ou o app.
// Sem Supabase configurado, cai direto no app (modo local, como antes).
function AppGate() {
  const { configured, session, loading } = useAuth();

  if (configured && loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (configured && !session) {
    return <AuthScreen />;
  }

  return (
    <AppDataProvider>
      <RootNavigator />
    </AppDataProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppGate />
          <StatusBar style="light" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
