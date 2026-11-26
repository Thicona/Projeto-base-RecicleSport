
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Ecoponto } from '../types/ecoponto';
import { ecopontoService } from '../services/EcopontoService';
import { UI_CONSTANTS } from '../utils/constants';

export function useEcopontos() {
  const [residuoSelecionado, setResiduoSelecionado] = useState<string>(
    UI_CONSTANTS.DEFAULT_RESIDUO_ID
  );

  const [busca, setBusca] = useState<string>('');
  const [pontosMapa, setPontosMapa] = useState<Ecoponto[]>([]);
  const [filtroCor, setFiltroCor] = useState<string | null>(null);

  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<boolean>(false);

  const carregarPontosMapa = useCallback(async () => {
    setCarregando(true);
    setErro(false);

    try {
      const dados = await ecopontoService.obterPontosMapa();
      setPontosMapa(dados);
    } catch (error) {
      console.error('Erro ao carregar ecopontos:', error);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPontosMapa();
  }, [carregarPontosMapa]);

  const pontosPorCategoria = useMemo(
    () => ecopontoService.listarPorCategoria(residuoSelecionado, busca),
    [residuoSelecionado, busca]
  );

  const pontosMapaFiltrados = useMemo(
    () => ecopontoService.filtrarPorCor(pontosMapa, filtroCor),
    [pontosMapa, filtroCor]
  );

  return {
    residuoSelecionado,
    setResiduoSelecionado,
    busca,
    setBusca,
    pontosPorCategoria,
    pontosMapaFiltrados,
    filtroCor,
    setFiltroCor,

    // Estados de carregamento e erro
    carregando,
    erro,

    // Função para tentar novamente
    recarregar: carregarPontosMapa,
  };
}
