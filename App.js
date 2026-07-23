import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppDataProvider } from './src/context/AppDataContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppDataProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </AppDataProvider>
    </GestureHandlerRootView>
  );
}
