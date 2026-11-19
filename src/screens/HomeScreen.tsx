import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ResiduoItem {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
}

interface EcopontoItem {
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
}

const RESIDUOS: ResiduoItem[] = [
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
  imagem: 'https://png.pngtree.com/png-vector/20240604/ourmid/pngtree-a-alkaline-batteries---isolated-png-image_12605194.png',
},

];

const ECOPONTOS: EcopontoItem[] = [
  // Pontos de Óleo de Cozinha (residuoId: '1')
  {
    id: 'oleo-1',
    residuoId: '1',
    icone: 'storefront',
    titulo: '1. Ponto de Coleta Supermercado',
    tituloTela: 'Coleta em Supermercados',
    subtitulo: '(Redes Parceiras e Mercados)',
    materiaisAceitos: 'Óleo de soja, girassol, canola, milho e azeite usados.',
    horarios: ['Seg a Sáb as 08:00 às 21:00'],
    regras: ['Esperar esfriar', 'Garrafa PET fechada', 'Não misturar com água'],
  },
  {
    id: 'oleo-2',
    residuoId: '1',
    icone: 'water',
    titulo: '2. Ecoponto Municipal Sabesp',
    tituloTela: 'Ecoponto Municipal Sabesp',
    subtitulo: '(Estações de Tratamento)',
    materiaisAceitos: 'Óleo vegetal de fritura doméstico e comercial.',
    horarios: ['Seg a Sex as 08:00 às 17:00'],
    regras: ['Coar restos de alimentos', 'Recipiente bem fechado'],
  },
  {
    id: 'oleo-3',
    residuoId: '1',
    icone: 'school',
    titulo: '3. Projeto Óleo Sustentável',
    tituloTela: 'Projeto Óleo Sustentável',
    subtitulo: '(Escolas e Associações)',
    materiaisAceitos: 'Óleo de cozinha usado filtrado.',
    horarios: ['Seg a Sex as 07:30 às 17:30'],
    regras: ['Entregar na secretaria', 'Apenas garrafas plásticas'],
  },

  // Pontos de E-Waste (residuoId: '2')
  {
    id: '1',
    residuoId: '2',
    icone: 'power-plug',
    titulo: '1. Totem Papa-Celular',
    tituloTela: 'Totem Papa-Celular',
    subtitulo: '(Shopping Centers e Metrô)',
    imagem: 'https://www.palmas.to.gov.br/media/imagem/noticia/6fb80642b796_db195e3e-cc86-4eb2-9486-0ee1c005c968.jpg',
    materiaisAceitos:
      'Baterias de celular, pilhas, power banks, dispositivos portáteis, cabos, fones de ouvido, pen drives e cartões de memória',
    horarios: [
      'Seg a Sáb as 10:00 às 22:00',
      'Dom e Feriados as 14:00 às 20:00',
    ],
    regras: [
      'Segurança de Dados',
      'Preparação do Item',
      'Condições do Resíduo',
    ],
  },
  {
    id: '2',
    residuoId: '2',
    icone: 'cellphone',
    titulo: '2. Urna de Logística Reversa',
    subtitulo: '(Operadoras e Assistências)',
  },
  {
    id: '3',
    residuoId: '2',
    icone: 'office-building',
    titulo: '3. Eco-Box Digital',
    subtitulo: '(Universidades, Órgãos Públicos)',
  },
  {
    id: '4',
    residuoId: '2',
    icone: 'tractor',
    titulo: '4. Cooperativa de Reciclagem Técnica',
    subtitulo: '(E-Waste Industrial)',
  },

  // Pontos de Pilhas e Baterias (residuoId: '3')
  {
    id: 'pilha-1',
    residuoId: '3',
    icone: 'battery-charging',
    titulo: '1. Coletor Papa-Pilhas',
    tituloTela: 'Coletor Papa-Pilhas',
    subtitulo: '(Farmácias e Drogarias)',
    materiaisAceitos: 'Pilhas AA, AAA, C, D, baterias 9V e baterias de relógio.',
    horarios: ['Seg a Dom as 08:00 às 22:00'],
    regras: ['Sem vazamento', 'Isolar polos com fita'],
  },
  {
    id: 'pilha-2',
    residuoId: '3',
    icone: 'bank',
    titulo: '2. Papa-Pilhas Bancário',
    tituloTela: 'Papa-Pilhas Bancário',
    subtitulo: '(Agências Bancárias)',
    materiaisAceitos: 'Pilhas comuns, recarregáveis e baterias de celular.',
    horarios: ['Seg a Sex as 10:00 às 16:00'],
    regras: ['Depositar na urna verde', 'Embalar baterias danificadas'],
  },
  {
    id: 'pilha-3',
    residuoId: '3',
    icone: 'cart',
    titulo: '3. Ponto Verde Construção',
    tituloTela: 'Ponto Verde Construção',
    subtitulo: '(Home Centers e Lojas Elétricas)',
    materiaisAceitos: 'Baterias de ferramentas sem fio, nobreaks e pilhas.',
    horarios: ['Seg a Sáb as 08:00 às 20:00'],
    regras: ['Isolar contatos metálicos', 'Sem vazamento ácido'],
  },
];

export default function HomeScreen({ navigation }: any) {
  const [busca, setBusca] = useState<string>('');
  const [residuoSelecionado, setResiduoSelecionado] = useState<string>('2');

  const pontosFiltrados = ECOPONTOS.filter(
    (ponto) =>
      ponto.residuoId === residuoSelecionado &&
      (ponto.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        ponto.subtitulo.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CABEÇALHO CURVO */}
        <View style={styles.headerContainer}>
          <View style={styles.headerWaveLight} />
          <View style={styles.headerWaveMain} />

          {/* Barra Superior: Avatar e Busca */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.avatarCircle} onPress={() => navigation.navigate('Perfil')}>
              <Ionicons name="person" size={32} color="#35B895" />
            </TouchableOpacity>

            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#999"
                value={busca}
                onChangeText={setBusca}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="search" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logo Central Flutuante */}
          <View style={styles.logoCard}>
            <MaterialCommunityIcons name="recycle" size={64} color="#35B895" />
          </View>
        </View>

        {/* SEÇÃO 1: TIPOS DE RESÍDUOS */}
        <Text style={styles.sectionTitle}>TIPOS DE RESÍDUOS</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {RESIDUOS.map((item) => {
            const isSelected = item.id === residuoSelecionado;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => setResiduoSelecionado(item.id)}
                style={[
                  styles.residuoCard,
                  isSelected ? styles.residuoCardActive : styles.residuoCardInactive,
                ]}
              >
                {item.titulo ? <Text style={styles.residuoTitle}>{item.titulo}</Text> : null}

                <Image
                  source={{ uri: item.imagem }}
                  style={isSelected ? styles.residuoImgLarge : styles.residuoImgSmall}
                  resizeMode="contain"

                />

                {item.descricao ? (
                  <Text style={styles.residuoDesc}>{item.descricao}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SEÇÃO 2: PONTOS DE ECOPONTOS */}
        <Text style={styles.sectionTitle}>PONTOS DE ECOPONTOS</Text>

        <View style={styles.ecopontosWrapper}>
          <View style={styles.ecopontosInnerCard}>
            {pontosFiltrados.map((ponto) => (
              <TouchableOpacity
                key={ponto.id}
                style={styles.ecopontoItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DetalhesEcoponto', { ponto: ponto })}
              >
                <View style={styles.ecopontoHeaderRow}>
                  <MaterialCommunityIcons
                    name={ponto.icone}
                    size={22}
                    color="#1E3A34"
                    style={styles.ecopontoIcon}
                  />
                  <Text style={styles.ecopontoTitle}>{ponto.titulo}</Text>
                </View>
                <Text style={styles.ecopontoSubtitle}>{ponto.subtitulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF9',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    height: 240,
    position: 'relative',
    alignItems: 'center',
  },
  headerWaveLight: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: width * 0.85,
    height: 240,
    backgroundColor: '#B5EAD7',
    borderBottomLeftRadius: 160,
  },
  headerWaveMain: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: width * 0.82,
    height: 250,
    backgroundColor: '#35B895',
    borderBottomRightRadius: 180,
    borderBottomLeftRadius: 60,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 44,
    zIndex: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 4,
    height: 38,
    width: width * 0.52,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    paddingVertical: 0,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#232B32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 112,
    height: 112,
    borderRadius: 26,
    backgroundColor: '#13222A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    zIndex: 3,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: '#284652',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#35B895',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  carouselContainer: {
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 12,
  },
  residuoCard: {
    borderRadius: 28,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  residuoCardInactive: {
    width: 125,
    height: 175,
    backgroundColor: '#DCEEE8',
  },
  residuoCardActive: {
    width: 155,
    height: 195,
    backgroundColor: '#8ED6C1',
    justifyContent: 'center',
    elevation: 3,
  },
  residuoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A7D6B',
    textAlign: 'center',
    lineHeight: 18,
  },
  residuoImgSmall: {
    width: 65,
    height: 65,
    marginVertical: 6,
  },
  residuoImgLarge: {
    width: 115,
    height: 115,
  },
  residuoDesc: {
    fontSize: 10,
    color: '#4B8B7A',
    textAlign: 'center',
    lineHeight: 13,
  },
  ecopontosWrapper: {
    marginHorizontal: 18,
    backgroundColor: '#DDF3EC',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 12,
  },
  ecopontosInnerCard: {
    backgroundColor: '#A2DEC9',
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 16,
  },
  ecopontoItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 10,
  },
  ecopontoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecopontoIcon: {
    marginRight: 8,
  },
  ecopontoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102A24',
    flexShrink: 1,
  },
  ecopontoSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102A24',
    marginTop: 2,
  },
});
