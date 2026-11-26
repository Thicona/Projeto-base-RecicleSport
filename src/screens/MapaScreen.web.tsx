// src/screens/MapaScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList, RootStackParamList } from '../types/navigation';
import { Ecoponto } from '../types/ecoponto';
import { useLocation } from '../hooks/useLocation';
import { useEcopontos } from '../hooks/useEcopontos';
import { gerarHtmlMapaLeaflet } from '../utils/leafletTemplate';
import { LEGENDA_CORES_DATA } from '../utils/mockData';
import { OrganicHeader } from '../components/OrganicHeader';
import { COLORS, BORDER_RADIUS } from '../utils/theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Mapa'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function MapaScreen({ navigation }: Props) {
  const { userLocation, loadingGps, centerLat, centerLng } = useLocation();
  const { pontosMapaFiltrados, filtroCor, setFiltroCor } = useEcopontos();
  const [pontoSelecionado, setPontoSelecionado] = useState<Ecoponto | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SELECT_PONTO') {
        const encontrado = pontosMapaFiltrados.find((p) => p.id === event.data.id);
        if (encontrado) setPontoSelecionado(encontrado);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pontosMapaFiltrados]);

  const mapDataUri = `data:text/html;charset=utf-8,${encodeURIComponent(
    gerarHtmlMapaLeaflet(centerLat, centerLng, userLocation, pontosMapaFiltrados)
  )}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OrganicHeader title="EcoPontos" height={130} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapWrapperCard}>
          <View style={styles.mapContainer}>
            {loadingGps ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={COLORS.primaryDark} />
                <Text style={styles.loadingText}>Carregando mapa e GPS...</Text>
              </View>
            ) : (
              <iframe src={mapDataUri} style={{ width: '100%', height: '100%', border: 'none' }} title="Mapa EcoPontos" />
            )}

            {pontoSelecionado && (
              <View style={styles.floatingCard}>
                <View style={styles.floatingHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: pontoSelecionado.corPino }]} />
                  <Text style={styles.floatingTitle} numberOfLines={1}>{pontoSelecionado.nome}</Text>
                  <TouchableOpacity onPress={() => setPontoSelecionado(null)}>
                    <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.floatingCategory}>Material: {pontoSelecionado.categoria}</Text>
                <Text style={styles.floatingAddress} numberOfLines={1}>{pontoSelecionado.endereco}</Text>

                <View style={styles.floatingFooter}>
                  <Text style={styles.floatingHours}>{pontoSelecionado.horarios}</Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('DetalhesEcoponto', { ponto: pontoSelecionado })}
                  >
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.mapCardFooter}>
            <Text style={styles.legendHeading}>Pontos correspondentes às cores:</Text>
            <TouchableOpacity style={styles.favoritesLink} onPress={() => navigation.navigate('Favoritos')}>
              <Text style={styles.favoritesLinkText}>Pontos favoritos →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.legendListContainer}>
          {LEGENDA_CORES_DATA.map((item) => {
            const ativo = filtroCor === item.cor;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.legendRow, ativo && styles.legendRowActive]}
                onPress={() => {
                  setPontoSelecionado(null);
                  setFiltroCor(ativo ? null : item.cor);
                }}
              >
                <Ionicons name="location-sharp" size={24} color={item.cor} style={styles.legendIcon} />
                <Text style={[styles.legendLabel, { color: item.cor === '#D9D9D9' ? COLORS.textMuted : item.cor }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 28 },
  mapWrapperCard: { backgroundColor: COLORS.primarySoft, borderRadius: 26, padding: 12, marginTop: 8 },
  mapContainer: { height: 290, borderRadius: 20, overflow: 'hidden', position: 'relative', backgroundColor: '#E2E8F0' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, fontWeight: '600', color: '#065F46' },
  floatingCard: { position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: 12, elevation: 6 },
  floatingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  floatingTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  floatingCategory: { fontSize: 12, fontWeight: '600', color: COLORS.primaryDark },
  floatingAddress: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  floatingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  floatingHours: { fontSize: 10, color: COLORS.textMuted, flex: 1 },
  detailsButton: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  detailsButtonText: { color: COLORS.surface, fontSize: 11, fontWeight: '700' },
  mapCardFooter: { marginTop: 10, alignItems: 'center' },
  legendHeading: { fontSize: 15, fontWeight: '700', color: COLORS.primaryDark },
  favoritesLink: { alignSelf: 'flex-end', marginTop: 4 },
  favoritesLinkText: { fontSize: 11, fontWeight: '700', color: COLORS.primaryDark },
  legendListContainer: { marginTop: 14, paddingHorizontal: 8, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 10 },
  legendRowActive: { backgroundColor: '#ECFDF5' },
  legendIcon: { marginRight: 10 },
  legendLabel: { fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
});
