// src/hooks/useDescarte.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { descarteService } from '../services/DescarteService';
import { CAMERA_CONFIG } from '../utils/constants';

export function useDescarte() {
  const [count, setCount] = useState<number>(CAMERA_CONFIG.INITIAL_COUNT);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    descarteService.obterRegistro().then((reg) => {
      setCount(reg.count);
      setFotoUri(reg.uri);
    });
  }, []);

  const executarCaptura = useCallback(async () => {
    setLoading(true);
    try {
      const novo = await descarteService.capturarComprovante(count);
      if (novo) {
        setCount(novo.count);
        setFotoUri(novo.uri);
        Alert.alert('Comprovante salvo!', 'Foto do descarte registrada com sucesso.');
      }
    } catch (error: any) {
      if (error.message === 'PERMISSION_DENIED') {
        Alert.alert('Permissão necessária', 'Ative a câmera para comprovar o descarte.');
      } else {
        Alert.alert('Erro na câmera', 'Não foi possível capturar a foto agora.');
      }
    } finally {
      setLoading(false);
    }
  }, [count]);

  const registrarNovoDescarte = useCallback(() => {
    const mensagem = 'Deseja abrir a câmera para fotografar o material entregue no ecoponto?';
    if (Platform.OS === 'web') {
      if (window.confirm(mensagem)) executarCaptura();
      return;
    }
    Alert.alert('Registrar Descarte', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir Câmera', onPress: executarCaptura },
    ]);
  }, [executarCaptura]);

  return {
    formattedCount: String(count).padStart(2, '0'),
    fotoUri,
    loading,
    registrarNovoDescarte,
  };
}
