
import NetInfo from '@react-native-community/netinfo';

import { Ecoponto } from '../types/ecoponto';
import { STORAGE_KEYS } from '../utils/constants';
import {
  ECOPONTOS_CATEGORIA_DATA,
  PONTOS_MAPA_DATA,
} from '../utils/mockData';
import { storageService } from './StorageService';

export class EcopontoService {
  listarPorCategoria(
    residuoId: string,
    termoBusca: string = ''
  ): Ecoponto[] {
    const termo = termoBusca.trim().toLowerCase();

    return ECOPONTOS_CATEGORIA_DATA.filter((ponto) => {
      const bateCategoria = ponto.residuoId === residuoId;

      const bateBusca =
        !termo ||
        ponto.nome.toLowerCase().includes(termo) ||
        (ponto.subtitulo?.toLowerCase().includes(termo) ?? false);

      return bateCategoria && bateBusca;
    });
  }

  async obterPontosMapa(): Promise<Ecoponto[]> {
    const connection = await NetInfo.fetch();

    if (
      connection.isConnected === false ||
      connection.isInternetReachable === false
    ) {
      throw new Error('Sem conexão com a internet.');
    }

    const cached = await storageService.getItem<Ecoponto[]>(
      STORAGE_KEYS.MAPA_PONTOS
    );

    if (cached && cached.length > 0) {
      return cached;
    }

    await storageService.setItem(
      STORAGE_KEYS.MAPA_PONTOS,
      PONTOS_MAPA_DATA
    );

    return PONTOS_MAPA_DATA;
  }

  filtrarPorCor(
    pontos: Ecoponto[],
    corPino: string | null
  ): Ecoponto[] {
    if (!corPino) return pontos;

    return pontos.filter(
      (ponto) => ponto.corPino === corPino
    );
  }
}

export const ecopontoService = new EcopontoService();
