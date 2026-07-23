import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import WorkoutHomeScreen from '../screens/treino/WorkoutHomeScreen';
import ExerciseLibraryScreen from '../screens/treino/ExerciseLibraryScreen';
import ExerciseFormScreen from '../screens/treino/ExerciseFormScreen';
import WorkoutTemplateEditorScreen from '../screens/treino/WorkoutTemplateEditorScreen';
import WorkoutSessionScreen from '../screens/treino/WorkoutSessionScreen';
import WorkoutGeneratorScreen from '../screens/treino/WorkoutGeneratorScreen';
import ExercisePickerScreen from '../screens/treino/ExercisePickerScreen';

import DietHomeScreen from '../screens/dieta/DietHomeScreen';
import FoodCatalogScreen from '../screens/dieta/FoodCatalogScreen';
import FoodFormScreen from '../screens/dieta/FoodFormScreen';
import AddMealEntryScreen from '../screens/dieta/AddMealEntryScreen';
import MealPlanListScreen from '../screens/dieta/MealPlanListScreen';
import MealPlanEditorScreen from '../screens/dieta/MealPlanEditorScreen';
import MealPlanDetailScreen from '../screens/dieta/MealPlanDetailScreen';
import GoalSetupScreen from '../screens/dieta/GoalSetupScreen';

import ProgressScreen from '../screens/progresso/ProgressScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';
import ProfileSettingsScreen from '../screens/perfil/ProfileSettingsScreen';

const Tab = createBottomTabNavigator();
const TreinoStackNav = createNativeStackNavigator();
const DietaStackNav = createNativeStackNavigator();
const PerfilStackNav = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

function TreinoStack() {
  return (
    <TreinoStackNav.Navigator screenOptions={screenOptions}>
      <TreinoStackNav.Screen
        name="WorkoutHome"
        component={WorkoutHomeScreen}
        options={{ title: 'Treino' }}
      />
      <TreinoStackNav.Screen
        name="ExerciseLibrary"
        component={ExerciseLibraryScreen}
        options={{ title: 'Exercícios' }}
      />
      <TreinoStackNav.Screen
        name="ExerciseForm"
        component={ExerciseFormScreen}
        options={{ title: 'Exercício' }}
      />
      <TreinoStackNav.Screen
        name="WorkoutTemplateEditor"
        component={WorkoutTemplateEditorScreen}
        options={{ title: 'Treino' }}
      />
      <TreinoStackNav.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{ title: 'Lançar treino' }}
      />
      <TreinoStackNav.Screen
        name="WorkoutGenerator"
        component={WorkoutGeneratorScreen}
        options={{ title: 'Gerar treino' }}
      />
      <TreinoStackNav.Screen
        name="ExercisePicker"
        component={ExercisePickerScreen}
        options={{ title: 'Escolher exercício' }}
      />
    </TreinoStackNav.Navigator>
  );
}

function DietaStack() {
  return (
    <DietaStackNav.Navigator screenOptions={screenOptions}>
      <DietaStackNav.Screen name="DietHome" component={DietHomeScreen} options={{ title: 'Dieta' }} />
      <DietaStackNav.Screen
        name="FoodCatalog"
        component={FoodCatalogScreen}
        options={{ title: 'Alimentos' }}
      />
      <DietaStackNav.Screen name="FoodForm" component={FoodFormScreen} options={{ title: 'Alimento' }} />
      <DietaStackNav.Screen
        name="AddMealEntry"
        component={AddMealEntryScreen}
        options={{ title: 'Adicionar refeição' }}
      />
      <DietaStackNav.Screen
        name="MealPlanList"
        component={MealPlanListScreen}
        options={{ title: 'Cardápios' }}
      />
      <DietaStackNav.Screen
        name="MealPlanEditor"
        component={MealPlanEditorScreen}
        options={{ title: 'Cardápio' }}
      />
      <DietaStackNav.Screen
        name="MealPlanDetail"
        component={MealPlanDetailScreen}
        options={{ title: 'Cardápio' }}
      />
      <DietaStackNav.Screen name="GoalSetup" component={GoalSetupScreen} options={{ title: 'Meta' }} />
    </DietaStackNav.Navigator>
  );
}

function PerfilStack() {
  return (
    <PerfilStackNav.Navigator screenOptions={screenOptions}>
      <PerfilStackNav.Screen name="PerfilHome" component={PerfilScreen} options={{ title: 'Perfil' }} />
      <PerfilStackNav.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </PerfilStackNav.Navigator>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Treino: 'barbell',
              Dieta: 'restaurant',
              Progresso: 'stats-chart',
              Perfil: 'person',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Treino" component={TreinoStack} />
        <Tab.Screen name="Dieta" component={DietaStack} />
        <Tab.Screen name="Progresso" component={ProgressScreen} />
        <Tab.Screen name="Perfil" component={PerfilStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
