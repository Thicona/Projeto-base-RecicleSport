// src/types/navigation.ts
import { Ecoponto } from './ecoponto';
import { Usuario } from './usuario';

export type BottomTabParamList = {
  Home: undefined;
  Mapa: undefined;
  Favoritos: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Voluntario: undefined;
  MainTabs: { screen?: keyof BottomTabParamList; usuario?: Usuario } | undefined;
  DetalhesEcoponto: { ponto: Ecoponto };
};
