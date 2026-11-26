// src/services/LocationService.ts
import * as Location from 'expo-location';

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export class LocationService {
  async obterPosicaoAtual(): Promise<Coordenadas | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const position = await Location.getCurrentPositionAsync({});
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch {
      return null;
    }
  }
}

export const locationService = new LocationService();
