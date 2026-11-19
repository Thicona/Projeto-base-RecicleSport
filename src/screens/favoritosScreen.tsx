import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  DimensionValue,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CHAVE_FAVORITOS = '@reciclaspot:favoritos';

const PINOS_MAPA: { top: DimensionValue; left: DimensionValue }[] = [
  { top: '12%', left: '20%' },
  { top: '30%', left: '43%' },
  { top: '24%', left: '53%' },
  { top: '42%', left: '85%' },
  { top: '55%', left: '62%' },
  { top: '70%', left: '38%' },
  { top: '65%', left: '7%' },
];

export default function FavoritosScreen() {
  const navigation = useNavigation<any>();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarFavoritosOffline = useCallback(async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
      if (dadosSalvos !== null) {
        const listaParseada = JSON.parse(dadosSalvos);
        setFavoritos(Array.isArray(listaParseada) ? listaParseada : []);
      } else {
        setFavoritos([]);
      }
    } catch (error) {
      console.error('Erro ao ler dados offline do AsyncStorage:', error);
    } finally {
      setCarregando(false);
    }
  }, []);

  // 1. Garante a leitura imediata ao reabrir o app fechado
  useEffect(() => {
    carregarFavoritosOffline();
  }, [carregarFavoritosOffline]);

  // 2. Garante a atualização sempre que o usuário voltar para esta aba
  useFocusEffect(
    useCallback(() => {
      carregarFavoritosOffline();
    }, [carregarFavoritosOffline])
  );

  // Remove um ecoponto dos favoritos e atualiza o armazenamento local
  const handleRemoverFavorito = async (indexRemover: number) => {
    try {
      const novaLista = favoritos.filter((_, index) => index !== indexRemover);
      setFavoritos(novaLista);
      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao remover favorito offline:', error);
    }
  };

  // Abre os detalhes do ecoponto salvo mesmo sem conexão
  const handleAbrirDetalhesOffline = (ponto: any) => {
    if (!modoEdicao) {
      navigation.navigate('DetalhesEcoponto', { ponto });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Cabeçalho Orgânico Verde */}
        <View style={styles.headerContainer}>
          <View style={styles.circleDarkGreen} />
          <View style={styles.circleLightGreen} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
          >
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Locais salvos</Text>
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-offline-outline" size={14} color="#FFFFFF" />
            <Text style={styles.offlineBadgeText}>Disponível offline</Text>
          </View>
        </View>

        {/* Área do Mapa Offline com Pinos */}
        <View style={styles.mapWrapper}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapRiver} />
            <View style={styles.mapRoad1} />
            <View style={styles.mapRoad2} />

            {favoritos.length > 0 &&
              PINOS_MAPA.slice(0, favoritos.length).map((pos, index) => (
                <View
                  key={index}
                  style={[styles.pin, { top: pos.top, left: pos.left }]}
                >
                  <View style={styles.pinDot} />
                </View>
              ))}
          </View>
        </View>

        {/* Lista de Favoritos */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Favoritos ({favoritos.length}):</Text>

          {carregando ? (
            <ActivityIndicator size="small" color="#23B584" style={{ marginTop: 20 }} />
          ) : favoritos.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum ecoponto favoritado ainda. Clique no coração na tela de detalhes para salvar e acessar sem internet.
            </Text>
          ) : (
            favoritos.map((item, index) => {
              const nomePonto = item.tituloTela || item.titulo || item.nome || 'Ecoponto';
              const enderecoPonto =
                item.endereco ||
                (item.bairro
                  ? `${item.endereco}, ${item.bairro} - ${item.cidade}`
                  : 'Endereço salvo localmente');

              return (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.addressItem}
                  activeOpacity={modoEdicao ? 1 : 0.7}
                  onPress={() => handleAbrirDetalhesOffline(item)}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.ecopontoName}>{nomePonto}</Text>
                    <Text style={styles.addressText}>
                      <Text style={styles.addressLabel}>Endereço: </Text>
                      {enderecoPonto}
                    </Text>
                  </View>

                  {modoEdicao ? (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoverFavorito(index)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Botão Editar Favoritos */}
        {favoritos.length > 0 && (
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => setModoEdicao(!modoEdicao)}
            >
              <Text style={styles.primaryButtonText}>
                {modoEdicao ? 'Concluir edição' : 'Editar favoritos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    height: 230,
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  circleDarkGreen: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 340,
    height: 320,
    borderRadius: 170,
    backgroundColor: '#23B584',
    zIndex: 2,
  },
  circleLightGreen: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 220,
    borderRadius: 120,
    backgroundColor: '#7AD4B4',
    zIndex: 1,
  },
  backButton: {
    zIndex: 3,
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    zIndex: 3,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 38,
  },
  offlineBadge: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    gap: 5,
  },
  offlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mapWrapper: {
    paddingHorizontal: 28,
    marginTop: 10,
  },
  mapPlaceholder: {
    height: 195,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#9CE0C9',
    backgroundColor: '#F3EFE6',
    overflow: 'hidden',
    position: 'relative',
  },
  mapRiver: {
    position: 'absolute',
    width: '130%',
    height: 32,
    backgroundColor: '#A9C8E8',
    top: 65,
    left: -20,
    transform: [{ rotate: '-25deg' }],
  },
  mapRoad1: {
    position: 'absolute',
    width: 6,
    height: '140%',
    backgroundColor: '#E6B87D',
    left: '35%',
    top: -20,
    transform: [{ rotate: '18deg' }],
  },
  mapRoad2: {
    position: 'absolute',
    width: '120%',
    height: 5,
    backgroundColor: '#FFFFFF',
    top: '65%',
    left: -10,
    transform: [{ rotate: '8deg' }],
  },
  pin: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9E2A58',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pinDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: 28,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23B584',
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  ecopontoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  addressLabel: {
    fontWeight: '700',
    color: '#1E1E1E',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  footerButtonContainer: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#23B584',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});