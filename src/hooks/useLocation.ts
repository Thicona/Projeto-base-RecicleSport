// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import { Coordenadas, locationService } from '../services/LocationService';
import { MAP_CONFIG } from '../utils/constants';

export function useLocation() {
  const [userLocation, setUserLocation] = useState<Coordenadas | null>(null);
  const [loadingGps, setLoadingGps] = useState<boolean>(true);

  useEffect(() => {
    locationService.obterPosicaoAtual().then((coords) => {
      setUserLocation(coords);
      setLoadingGps(false);
    });
  }, []);

  return {
    userLocation,
    loadingGps,
    centerLat: userLocation?.latitude ?? MAP_CONFIG.DEFAULT_LATITUDE,
    centerLng: userLocation?.longitude ?? MAP_CONFIG.DEFAULT_LONGITUDE,
  };
}
