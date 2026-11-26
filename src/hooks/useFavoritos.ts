// src/hooks/useFavoritos.ts
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ecoponto } from '../types/ecoponto';
import { favoritosService } from '../services/FavoritosService';

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Ecoponto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregar = useCallback(async () => {
    const lista = await favoritosService.listar();
    setFavoritos(lista);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const toggleFavorito = useCallback(async (ponto: Ecoponto) => {
    const atualizados = await favoritosService.alternar(ponto);
    setFavoritos(atualizados);
  }, []);

  const removerFavorito = useCallback(async (id: string) => {
    const atualizados = await favoritosService.removerPorId(id);
    setFavoritos(atualizados);
  }, []);

  const verificarFavorito = useCallback(
    (ponto?: Ecoponto) => (ponto ? favoritosService.isFavorito(favoritos, ponto) : false),
    [favoritos]
  );

  return {
    favoritos,
    carregando,
    toggleFavorito,
    removerFavorito,
    verificarFavorito,
  };
}
