// src/services/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Erro ao ler ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Erro ao salvar ${key}:`, error);
    }
  }
}

export const storageService = new StorageService();
