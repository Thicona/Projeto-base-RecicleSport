// src/types/ecoponto.ts
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Residuo {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
}

export interface Ecoponto {
  id: string;
  nome: string;
  subtitulo?: string;
  residuoId?: string;
  categoria?: string;
  icone?: keyof typeof MaterialCommunityIcons.glyphMap;
  corPino?: string;
  endereco: string;
  bairro?: string;
  imagem?: string;
  materiaisAceitos: string;
  horarios: string[];
  regras: string[];
  latitude?: number;
  longitude?: number;
}

export interface LegendaMapa {
  label: string;
  cor: string;
}
