// src/services/DescarteService.ts
import * as ImagePicker from 'expo-image-picker';
import { DescarteRegistro } from '../types/usuario';
import { CAMERA_CONFIG, STORAGE_KEYS } from '../utils/constants';
import { storageService } from './StorageService';

export class DescarteService {
  async obterRegistro(): Promise<DescarteRegistro> {
    const salvo = await storageService.getItem<DescarteRegistro>(STORAGE_KEYS.DESCARTE_PERFIL);
    return salvo ?? { count: CAMERA_CONFIG.INITIAL_COUNT, uri: null };
  }

  async capturarComprovante(countAtual: number): Promise<DescarteRegistro | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('PERMISSION_DENIED');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: CAMERA_CONFIG.ASPECT_RATIO,
      quality: CAMERA_CONFIG.QUALITY,
    });

    if (result.canceled || !result.assets?.length) return null;

    const novoRegistro: DescarteRegistro = {
      count: countAtual + 1,
      uri: result.assets[0].uri,
    };

    await storageService.setItem(STORAGE_KEYS.DESCARTE_PERFIL, novoRegistro);
    return novoRegistro;
  }
}

export const descarteService = new DescarteService();
