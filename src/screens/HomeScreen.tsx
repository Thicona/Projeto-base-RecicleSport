
import React from 'react';

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

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BottomTabParamList,
  RootStackParamList,
} from '../types/navigation';

import { useEcopontos } from '../hooks/useEcopontos';

import { RESIDUOS_DATA } from '../utils/mockData';

import { OrganicHeader } from '../components/OrganicHeader';

import { COLORS, COMMON_STYLES } from '../utils/theme';

const { width } = Dimensions.get('window');

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const {
    residuoSelecionado,
    setResiduoSelecionado,
    busca,
    setBusca,
    pontosPorCategoria,
    erro,
    carregando,
    recarregar,
  } = useEcopontos();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <OrganicHeader height={230}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.avatarCircle, COMMON_STYLES.shadowSm]}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Ionicons
                name="person"
                size={30}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <View style={[styles.searchWrapper, COMMON_STYLES.shadowSm]}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor={COLORS.textMuted}
                value={busca}
                onChangeText={setBusca}
              />

              <View style={styles.searchButton}>
                <Ionicons
                  name="search"
                  size={18}
                  color={COLORS.surface}
                />
              </View>
            </View>
          </View>

          <View style={[styles.logoCard, COMMON_STYLES.shadowMd]}>
            <MaterialCommunityIcons
              name="recycle"
              size={64}
              color={COLORS.primary}
            />
          </View>
        </OrganicHeader>

        <Text style={styles.sectionTitle}>
          TIPOS DE RESÍDUOS
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {RESIDUOS_DATA.map((item) => {
            const isSelected = item.id === residuoSelecionado;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => setResiduoSelecionado(item.id)}
                style={[
                  styles.residuoCard,
                  isSelected
                    ? styles.residuoCardActive
                    : styles.residuoCardInactive,
                ]}
              >
                <Text style={styles.residuoTitle}>
                  {item.titulo}
                </Text>

                <Image
                  source={{ uri: item.imagem }}
                  style={
                    isSelected
                      ? styles.residuoImgLarge
                      : styles.residuoImgSmall
                  }
                  resizeMode="contain"
                />

                <Text style={styles.residuoDesc}>
                  {item.descricao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          PONTOS DE ECOPONTOS
        </Text>

        <View style={styles.ecopontosWrapper}>
          <View style={styles.ecopontosInnerCard}>

            {erro ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="wifi-off"
                  size={48}
                  color="#1E3A34"
                />

                <Text style={styles.errorTitle}>
                  Erro ao carregar dados
                </Text>

                <Text style={styles.errorMessage}>
                  Verifique sua conexão com a internet e tente novamente.
                </Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={recarregar}
                  activeOpacity={0.8}
                  disabled={carregando}
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.retryButtonText}>
                    Tentar Novamente
                  </Text>
                </TouchableOpacity>
              </View>

            ) : carregando ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons
                  name="recycle"
                  size={36}
                  color="#1E3A34"
                />

                <Text style={styles.loadingText}>
                  Carregando ecopontos...
                </Text>
              </View>

            ) : pontosPorCategoria.length > 0 ? (
              pontosPorCategoria.map((ponto) => (
                <TouchableOpacity
                  key={ponto.id}
                  style={styles.ecopontoItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('DetalhesEcoponto', { ponto })
                  }
                >
                  <View style={styles.ecopontoHeaderRow}>
                    <MaterialCommunityIcons
                      name={ponto.icone || 'recycle'}
                      size={22}
                      color="#1E3A34"
                      style={styles.ecopontoIcon}
                    />

                    <Text style={styles.ecopontoTitle}>
                      {ponto.nome}
                    </Text>
                  </View>

                  {ponto.subtitulo && (
                    <Text style={styles.ecopontoSubtitle}>
                      {ponto.subtitulo}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="map-search-outline"
                  size={40}
                  color="#1E3A34"
                />

                <Text style={styles.emptyText}>
                  Nenhum ecoponto encontrado.
                </Text>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    zIndex: 3,
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 4,
    height: 38,
    width: width * 0.55,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
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
    alignSelf: 'center',
    width: 112,
    height: 112,
    borderRadius: 26,
    backgroundColor: COLORS.darkBrand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    zIndex: 3,
    borderWidth: 2,
    borderColor: '#284652',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 14,
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
  },

  residuoImgSmall: {
    width: 65,
    height: 65,
    marginVertical: 6,
  },

  residuoImgLarge: {
    width: 105,
    height: 105,
  },

  residuoDesc: {
    fontSize: 10,
    color: '#4B8B7A',
    textAlign: 'center',
  },

  ecopontosWrapper: {
    marginHorizontal: 18,
    backgroundColor: '#DDF3EC',
    borderRadius: 30,
    padding: 12,
  },

  ecopontosInnerCard: {
    backgroundColor: '#A2DEC9',
    borderRadius: 24,
    padding: 16,
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

  // ESTILOS DO ERRO

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102A24',
    textAlign: 'center',
    marginTop: 12,
  },

  errorMessage: {
    fontSize: 14,
    color: '#365C50',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A34',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 18,
    gap: 8,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ESTILOS DO CARREGAMENTO

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A34',
    marginTop: 10,
  },

  // ESTILOS QUANDO NÃO HÁ RESULTADOS

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102A24',
    marginTop: 10,
    textAlign: 'center',
  },
});
