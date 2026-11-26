// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, BottomTabParamList } from '../types/navigation';
import { COLORS } from '../utils/theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import VoluntarioScreen from '../screens/VoluntarioScreen';
import HomeScreen from '../screens/HomeScreen';
import EcopontoDetailScreen from '../screens/EcopontoDetailScreen';
import MapaScreen from '../screens/MapaScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_BAR_CONFIG = {
  HEIGHT: 60,
  PADDING_BOTTOM: 8,
  PADDING_TOP: 6,
  INACTIVE_COLOR: '#64748B',
} as const;

const TAB_ICONS: Record<keyof BottomTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Mapa: 'map',
  Favoritos: 'heart',
  Perfil: 'person',
};

type MainTabsProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

function MainTabs({ route }: MainTabsProps) {
  const usuario = route.params?.usuario;

  return (
    <Tab.Navigator
      screenOptions={({ route: tabRoute }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: TAB_BAR_CONFIG.INACTIVE_COLOR,
        tabBarStyle: {
          height: TAB_BAR_CONFIG.HEIGHT,
          paddingBottom: TAB_BAR_CONFIG.PADDING_BOTTOM,
          paddingTop: TAB_BAR_CONFIG.PADDING_TOP,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[tabRoute.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Perfil">
        {() => <PerfilScreen usuario={usuario} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Voluntario" component={VoluntarioScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DetalhesEcoponto" component={EcopontoDetailScreen} />
    </Stack.Navigator>
  );
}
