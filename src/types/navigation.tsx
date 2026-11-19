import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from '../screens/welcome';
import VoluntarioScreen, { Usuario } from '../screens/voluntario';
import HomeScreen from '../screens/HomeScreen';
import EcopontoDetailScreen from '../screens/EcopontoDetailScreen';
import MapaScreen from '../screens/mapa';
import FavoritosScreen from '../screens/favoritosScreen';
import PerfilScreen from '../screens/perfilScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Voluntario: undefined;
  MainTabs: { usuario?: Usuario } | undefined;
  DetalhesEcoponto: { ponto: any };
};

export type BottomTabParamList = {
  Home: undefined;
  Mapa: undefined;
  Favoritos: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

type MainTabsProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

function MainTabs({ route }: MainTabsProps) {
  const usuario = route.params?.usuario;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#21B086',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Mapa') iconName = 'map';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Perfil">
        {(props) => <PerfilScreen {...props} usuario={usuario} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Voluntario" component={VoluntarioScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetalhesEcoponto" component={EcopontoDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
