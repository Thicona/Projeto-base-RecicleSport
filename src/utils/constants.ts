// src/utils/constants.ts
import { DimensionValue } from 'react-native';

export const STORAGE_KEYS = {
  FAVORITOS: '@reciclaspot:favoritos',
  MAPA_PONTOS: '@reciclaspot:mapa_pontos',
  DESCARTE_PERFIL: '@reciclaspot:descarte_perfil',
  USUARIO: '@reciclaspot:usuario',
} as const;

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: -21.7975,
  DEFAULT_LONGITUDE: -50.879,
  DEFAULT_ZOOM: 14,
  USER_MARKER_COLOR: '#2563EB',
} as const;

export const CAMERA_CONFIG = {
  ASPECT_RATIO: [4, 3] as [number, number],
  QUALITY: 0.7,
  INITIAL_COUNT: 3,
} as const;

export const UI_CONSTANTS = {
  DEFAULT_ECOPONTO_IMAGE:
    'https://palmas.to.gov.br',
  DEFAULT_RESIDUO_ID: '2',
  OFFLINE_PINS_POSITIONS: [
    { top: '12%', left: '20%' },
    { top: '30%', left: '43%' },
    { top: '24%', left: '53%' },
    { top: '42%', left: '85%' },
    { top: '55%', left: '62%' },
    { top: '70%', left: '38%' },
    { top: '65%', left: '7%' },
  ] as { top: DimensionValue; left: DimensionValue }[],
} as const;
