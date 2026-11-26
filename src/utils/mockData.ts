// src/utils/mockData.ts
import { Ecoponto, LegendaMapa, Residuo } from '../types/ecoponto';

export const RESIDUOS_DATA: Residuo[] = [
  {
    id: '1',
    titulo: 'Óleo de\nCozinha',
    descricao: 'Descarte de óleo usado em garrafas PET.',
    imagem: 'https://png.pngtree.com/png-vector/20250607/ourmid/pngtree-high-quality-studio-shot-of-a-plastic-cooking-oil-bottle-png-image_16486618.png',
  },
  {
    id: '2',
    titulo: 'E-Waste',
    descricao: 'Para celulares velhos, cabos, computadores e placas.',
    imagem: 'https://png.pngtree.com/png-clipart/20240210/original/pngtree-old-mobile-phone-on-white-background-retro-photo-png-image_14273201.png',
  },
  {
    id: '3',
    titulo: 'Pilhas e\nBaterias',
    descricao: 'Descarte de pilhas comuns, alcalinas e baterias usadas.',
    imagem: 'https://png.pngtree.com/png-clipart/20250206/original/pngtree-a-pile-of-blue-aaaa-batteries-with-plus-and-minus-signs-png-image_20330092.png',
  },
];

export const ECOPONTOS_CATEGORIA_DATA: Ecoponto[] = [
  {
    id: 'oleo-1',
    residuoId: '1',
    icone: 'storefront',
    nome: 'Coleta em Supermercados',
    subtitulo: '(Redes Parceiras e Mercados)',
    endereco: 'Redes Parceiras Locais - Consulte a unidade mais próxima',
    materiaisAceitos: 'Óleo de soja, girassol, canola, milho e azeite usados.',
    horarios: ['Seg a Sáb das 08:00 às 21:00'],
    regras: ['Esperar esfriar', 'Garrafa PET fechada', 'Não misturar com água'],
  },
  {
    id: 'ewaste-1',
    residuoId: '2',
    icone: 'power-plug',
    nome: 'Totem Papa-Celular',
    subtitulo: '(Shopping Centers e Metrô)',
    endereco: 'Avenida Paulista, 1230 - Piso Térreo, Bela Vista',
    materiaisAceitos: 'Baterias de celular, pilhas, power banks, cabos, fones e pen drives.',
    horarios: ['Seg a Sáb das 10:00 às 22:00', 'Dom e Feriados das 14:00 às 20:00'],
    regras: ['Segurança de Dados', 'Preparação do Item', 'Condições do Resíduo'],
  },
  {
    id: 'pilha-1',
    residuoId: '3',
    icone: 'battery-charging',
    nome: 'Coletor Papa-Pilhas',
    subtitulo: '(Farmácias e Drogarias)',
    endereco: 'Farmácias credenciadas no centro comercial',
    materiaisAceitos: 'Pilhas AA, AAA, C, D, baterias 9V e baterias de relógio.',
    horarios: ['Seg a Dom das 08:00 às 22:00'],
    regras: ['Sem vazamento', 'Isolar polos com fita'],
  },
];

export const PONTOS_MAPA_DATA: Ecoponto[] = [
  {
    id: 'map-1',
    nome: 'EcoPonto Madeira Central',
    categoria: 'Madeira',
    corPino: '#000000',
    endereco: 'Av. Brasil, 450',
    bairro: 'Centro',
    materiaisAceitos: 'Madeira de construção, móveis desmontados e pallets.',
    horarios: ['Seg a Sáb das 08:00 às 18:00'],
    regras: ['Sem pregos expostos', 'Desmontar volumes grandes'],
    latitude: -21.7965,
    longitude: -50.8785,
  },
  {
    id: 'map-2',
    nome: 'Compostagem Parque Verde',
    categoria: 'Resíduos orgânicos',
    corPino: '#635116',
    endereco: 'Rua Rodolfo Zaros, 120',
    bairro: 'Jardim das Bandeiras',
    materiaisAceitos: 'Restos de frutas, verduras, borra de café e podas.',
    horarios: ['Seg a Sex das 07:00 às 17:00'],
    regras: ['Sem embalagens plásticas', 'Não misturar com carnes'],
    latitude: -21.7935,
    longitude: -50.8825,
  },
  {
    id: 'map-4',
    nome: 'Coleta Química & Baterias',
    categoria: 'Resíduos perigosos',
    corPino: '#F26419',
    endereco: 'Rua Feb, 780',
    bairro: 'Centro',
    materiaisAceitos: 'Baterias, lâmpadas fluorescentes e embalagens químicas.',
    horarios: ['Seg a Sáb das 09:00 às 19:00'],
    regras: ['Embalagem intacta', 'Não quebrar lâmpadas'],
    latitude: -21.8015,
    longitude: -50.8845,
  },
];

export const LEGENDA_CORES_DATA: LegendaMapa[] = [
  { label: 'Madeira', cor: '#000000' },
  { label: 'Resíduos orgânicos', cor: '#635116' },
  { label: 'Resíduos radioativos', cor: '#6C3CE9' },
  { label: 'Resíduos perigosos', cor: '#F26419' },
  { label: 'Resíduos não recicláveis ou contaminados', cor: '#8C8C8C' },
  { label: 'Resíduos de saúde', cor: '#D9D9D9' },
];
