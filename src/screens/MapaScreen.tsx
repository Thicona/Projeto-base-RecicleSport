import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const CACHE_PONTOS_KEY = '@reciclaspot:mapa_pontos';

export interface PontoMapa {
  id: string;
  nome: string;
  categoria: string;
  corPino: string;
  endereco: string;
  bairro: string;
  horarioFuncionamento: string;
  latitude: number;
  longitude: number;
}

type RootStackParamList = {
  MainTabs: undefined;
  Favoritos: undefined;
  DetalhesEcoponto: { ponto: PontoMapa };
};

type MapaScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const PONTOS_INICIAIS: PontoMapa[] = [
  {
    id: '1',
    nome: 'EcoPonto Madeira Central',
    categoria: 'Madeira',
    corPino: '#000000',
    endereco: 'Av. Brasil, 450',
    bairro: 'Centro',
    horarioFuncionamento: 'Seg a Sáb das 08:00 às 18:00',
    latitude: -21.7965,
    longitude: -50.8785,
  },
  {
    id: '2',
    nome: 'Compostagem Parque Verde',
    categoria: 'Resíduos orgânicos',
    corPino: '#635116',
    endereco: 'Rua Rodolfo Zaros, 120',
    bairro: 'Jardim das Bandeiras',
    horarioFuncionamento: 'Seg a Sex das 07:00 às 17:00',
    latitude: -21.7935,
    longitude: -50.8825,
  },
  {
    id: '3',
    nome: 'Unidade Controle Especial',
    categoria: 'Resíduos radioativos',
    corPino: '#6C3CE9',
    endereco: 'Av. Max Wirth, 900',
    bairro: 'Vila São José',
    horarioFuncionamento: '24 horas (Agendamento)',
    latitude: -21.7995,
    longitude: -50.8735,
  },
  {
    id: '4',
    nome: 'Coleta Química & Baterias',
    categoria: 'Resíduos perigosos',
    corPino: '#F26419',
    endereco: 'Rua Feb, 780',
    bairro: 'Centro',
    horarioFuncionamento: 'Seg a Sáb das 09:00 às 19:00',
    latitude: -21.8015,
    longitude: -50.8845,
  },
  {
    id: '5',
    nome: 'Estação de Rejeitos Sul',
    categoria: 'Resíduos não recicláveis ou contaminados',
    corPino: '#8C8C8C',
    endereco: 'Av. Presidente Roosevelt, 1500',
    bairro: 'Bairro Sul',
    horarioFuncionamento: 'Seg a Dom das 06:00 às 22:00',
    latitude: -21.8035,
    longitude: -50.8775,
  },
  {
    id: '6',
    nome: 'Posto Descarte Hospitalar',
    categoria: 'Resíduos de saúde',
    corPino: '#D9D9D9',
    endereco: 'Rua Hans Staden, 310',
    bairro: 'Santa Cruz',
    horarioFuncionamento: 'Seg a Sáb das 08:00 às 20:00',
    latitude: -21.7915,
    longitude: -50.8755,
  },
];

const LEGENDA_CORES = [
  { label: 'Madeira', cor: '#000000' },
  { label: 'Resíduos orgânicos', cor: '#635116' },
  { label: 'Resíduos radioativos', cor: '#6C3CE9' },
  { label: 'Resíduos perigosos', cor: '#F26419' },
  { label: 'Resíduos não recicláveis ou contaminados', cor: '#8C8C8C' },
  { label: 'Resíduos de saúde', cor: '#D9D9D9' },
];
export default function MapaScreen({ navigation }: MapaScreenProps) {
  const [pontos, setPontos] = useState<PontoMapa[]>(PONTOS_INICIAIS);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingGps, setLoadingGps] = useState<boolean>(true);
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoMapa | null>(
    null
  );
  const [filtroCor, setFiltroCor] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dadosOffline = await AsyncStorage.getItem(CACHE_PONTOS_KEY);
        if (dadosOffline) {
          setPontos(JSON.parse(dadosOffline));
        } else {
          await AsyncStorage.setItem(
            CACHE_PONTOS_KEY,
            JSON.stringify(PONTOS_INICIAIS)
          );
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const position = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      } catch (error) {
        console.log('Modo offline ou GPS indisponível na Web:', error);
      } finally {
        setLoadingGps(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SELECT_PONTO') {
        const encontrado = pontos.find((p) => p.id === event.data.id);
        if (encontrado) setPontoSelecionado(encontrado);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pontos]);

  const pontosExibidos = filtroCor
    ? pontos.filter((p) => p.corPino === filtroCor)
    : pontos;

  const centerLat = userLocation?.latitude ?? -21.7975;
  const centerLng = userLocation?.longitude ?? -50.879;

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com" />
      <script src="https://unpkg.com"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${centerLat}, ${centerLng}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        ${
          userLocation
            ? `L.circleMarker([${userLocation.latitude}, ${userLocation.longitude}], {
                radius: 8, fillColor: "#2563EB", color: "#FFFFFF", weight: 2, fillOpacity: 1
              }).addTo(map).bindPopup("Você está aqui");`
            : ''
        }

        var pontos = ${JSON.stringify(pontosExibidos)};
        pontos.forEach(function(p) {
          var iconHtml = '<div style="background-color:' + p.corPino + '; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4); cursor:pointer;"></div>';
          var customIcon = L.divIcon({ html: iconHtml, className: '', iconSize:, iconAnchor: [13, 13] });
          var marker = L.marker([p.latitude, p.longitude], { icon: customIcon }).addTo(map);
          marker.on('click', function() {
            window.parent.postMessage({ type: 'SELECT_PONTO', id: p.id }, '*');
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.topRightLightWave} />
        <View style={styles.topLeftDarkWave} />
        <Text style={styles.headerTitle}>EcoPontos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapWrapperCard}>
          <View style={styles.mapContainer}>
            {loadingGps ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#16A07A" />
                <Text style={styles.loadingText}>Carregando mapa e GPS...</Text>
              </View>
            ) : (
              <iframe
                srcDoc={leafletHtml}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Mapa Interativo EcoPontos"
              />
            )}

            {pontoSelecionado && (
              <View style={styles.floatingCard}>
                <View style={styles.floatingHeader}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: pontoSelecionado.corPino },
                    ]}
                  />
                  <Text style={styles.floatingTitle} numberOfLines={1}>
                    {pontoSelecionado.nome}
                  </Text>
                  <TouchableOpacity onPress={() => setPontoSelecionado(null)}>
                    <Ionicons name="close-circle" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.floatingCategory}>
                  Material: {pontoSelecionado.categoria}
                </Text>
                <Text style={styles.floatingAddress} numberOfLines={1}>
                  {pontoSelecionado.endereco} - {pontoSelecionado.bairro}
                </Text>

                <View style={styles.floatingFooter}>
                  <Text style={styles.floatingHours}>
                    {pontoSelecionado.horarioFuncionamento}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() =>
                      navigation.navigate('DetalhesEcoponto', {
                        ponto: pontoSelecionado,
                      })
                    }
                  >
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.mapCardFooter}>
            <Text style={styles.legendHeading}>
              Pontos correspondente as cores:
            </Text>
            <TouchableOpacity
              style={styles.favoritesLink}
              onPress={() => navigation.navigate('Favoritos')}
            >
              <Text style={styles.favoritesLinkText}>Pontos favoritos →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.legendListContainer}>
          {LEGENDA_CORES.map((item) => {
            const ativo = filtroCor === item.cor;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.legendRow, ativo && styles.legendRowActive]}
                activeOpacity={0.7}
                onPress={() => {
                  setPontoSelecionado(null);
                  setFiltroCor(ativo ? null : item.cor);
                }}
              >
                <Ionicons
                  name="location-sharp"
                  size={24}
                  color={item.cor}
                  style={styles.legendIcon}
                />
                <Text
                  style={[
                    styles.legendLabel,
                    { color: item.cor === '#D9D9D9' ? '#9CA3AF' : item.cor },
                  ]}
                >
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

export default MapaScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { height: 120, justifyContent: 'center', paddingHorizontal: 28 },
  topLeftDarkWave: { position: 'absolute', top: -50, left: -40, width: width * 0.72, height: 220, backgroundColor: '#16A07A', borderBottomRightRadius: 180 },
  topRightLightWave: { position: 'absolute', top: -30, right: -30, width: width * 0.55, height: 150, backgroundColor: '#98E6CE', borderBottomLeftRadius: 130 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 28 },
  mapWrapperCard: { backgroundColor: '#D2F4EA', borderRadius: 26, paddingTop: 14, paddingHorizontal: 12, paddingBottom: 10, marginTop: 8 },
  mapContainer: { height: 290, borderRadius: 20, overflow: 'hidden', position: 'relative', backgroundColor: '#E2E8F0' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, fontWeight: '600', color: '#065F46' },
  floatingCard: { position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, elevation: 6, zIndex: 1000 },
  floatingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  floatingTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0F172A' },
  floatingCategory: { fontSize: 12, fontWeight: '600', color: '#16A07A' },
  floatingAddress: { fontSize: 11, color: '#475569', marginTop: 2 },
  floatingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  floatingHours: { fontSize: 10, color: '#64748B', flex: 1 },
  detailsButton: { backgroundColor: '#16A07A', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  detailsButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  mapCardFooter: { marginTop: 10, alignItems: 'center' },
  legendHeading: { fontSize: 15, fontWeight: '700', color: '#16A07A' },
  favoritesLink: { alignSelf: 'flex-end', marginTop: 4, paddingRight: 4 },
  favoritesLinkText: { fontSize: 11, fontWeight: '700', color: '#16A07A' },
  legendListContainer: { marginTop: 14, paddingHorizontal: 8, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 },
  legendRowActive: { backgroundColor: '#ECFDF5' },
  legendIcon: { marginRight: 10 },
  legendLabel: { fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
});
