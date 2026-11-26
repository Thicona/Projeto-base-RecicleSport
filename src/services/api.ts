import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ==========================================
// 1. Tipagens (Idênticas às suas telas)
// ==========================================

export interface Ecoponto {
  id: string;
  residuoId: string;
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
  titulo: string;
  tituloTela?: string;
  subtitulo: string;
  endereco?: string;
  imagem?: string;
  materiaisAceitos?: string;
  horarios?: string[];
  regras?: string[];
  latitude?: number;
  longitude?: number;
}

export interface FiltrosEcoponto {
  material?: string;
  busca?: string;
  [key: string]: string | undefined;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  pontosReciclagem: number;
  fotoPerfilUri?: string;
  tipo?: 'cidadao' | 'voluntario';
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha?: string;
  tipo: 'cidadao' | 'voluntario';
}

// ==========================================
// 2. Instância Centralizada do Axios
// ==========================================

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3333'
    : 'http://localhost:3333';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 3. Interceptores
// ==========================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('@reciclaspot:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Erro ao ler token no interceptor:', error);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Não autorizado (401).');
      } else if (status === 404) {
        console.warn('Recurso não encontrado (404).');
      } else if (status >= 500) {
        console.error('Erro interno no servidor (500+).');
      }
    } else if (error.request) {
      console.error('Sem resposta da API. Verifique sua conexão.');
    }

    return Promise.reject(error);
  }
);

// ==========================================
// 4. Serviços dos Endpoints
// ==========================================

export const ecopontoService = {
  /**
   * GET /ecopontos?material=eletronico
   */
  listar: async (filtros?: FiltrosEcoponto): Promise<Ecoponto[]> => {
    const response = await api.get<Ecoponto[]>('/ecopontos', {
      params: filtros,
    });
    return response.data;
  },

  /**
   * GET /ecopontos/:id
   */
  buscarPorId: async (id: string): Promise<Ecoponto> => {
    const response = await api.get<Ecoponto>(`/ecopontos/${id}`);
    return response.data;
  },
};

export const usuarioService = {
  /**
   * POST /usuarios
   */
  cadastrar: async (dados: CriarUsuarioDTO): Promise<Usuario> => {
    const response = await api.post<Usuario>('/usuarios', dados);
    return response.data;
  },
};
