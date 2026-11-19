import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CHAVE_FAVORITOS = '@reciclaspot:favoritos';

export default function EcopontoDetailScreen({ route, navigation }: any) {
  const ecoponto = route?.params?.ponto;
  const [favorito, setFavorito] = useState<boolean>(false);

  // Verifica se este ecoponto já está salvo nos favoritos ao abrir a tela
  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
        if (salvos && ecoponto) {
          const lista = JSON.parse(salvos);
          const nomeAtual = ecoponto.tituloTela || ecoponto.titulo;
          const jaEstaSalvo = lista.some(
            (item: any) =>
              (item.id && item.id === ecoponto.id) ||
              (item.tituloTela || item.titulo) === nomeAtual
          );
          setFavorito(jaEstaSalvo);
        }
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      }
    };

    verificarFavorito();
  }, [ecoponto]);

  // Salva ou remove do AsyncStorage e vai para a aba Favoritos
  const handleFavoritar = async () => {
    if (!ecoponto) return;

    try {
      const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
      const lista = salvos ? JSON.parse(salvos) : [];
      const nomeAtual = ecoponto.tituloTela || ecoponto.titulo;

      const jaEstaSalvo = lista.some(
        (item: any) =>
          (item.id && item.id === ecoponto.id) ||
          (item.tituloTela || item.titulo) === nomeAtual
      );

      let novaLista;
      if (jaEstaSalvo) {
        novaLista = lista.filter(
          (item: any) =>
            !(
              (item.id && item.id === ecoponto.id) ||
              (item.tituloTela || item.titulo) === nomeAtual
            )
        );
        setFavorito(false);
      } else {
        novaLista = [...lista, ecoponto];
        setFavorito(true);
      }

      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novaLista));

      navigation.navigate('MainTabs', {
        screen: 'Favoritos',
      });
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Formas orgânicas verdes no topo */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleTopLeft} />

      {/* Cabeçalho Flutuante: Botão Voltar (<) e Botão Favoritar (Coração) */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritar}
          activeOpacity={0.8}
        >
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={26}
            color={favorito ? '#EF4444' : '#21B086'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Foto de Capa do Ecoponto */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                ecoponto?.imagem ||
                'https://www.palmas.to.gov.br/media/imagem/noticia/6fb80642b796_db195e3e-cc86-4eb2-9486-0ee1c005c968.jpg',
            }}
            style={styles.ecopontoImage}
            resizeMode="cover"
          />
        </View>



        {/* Título e Subtítulo */}
        <Text style={styles.title}>
          {ecoponto?.tituloTela || ecoponto?.titulo || 'Detalhes do Ecoponto'}
        </Text>
        <Text style={styles.subtitle}>{ecoponto?.subtitulo}</Text>

        {/* Seção: Endereço por extenso (sem botão de rota) */}
        <View style={styles.addressCard}>
          <Ionicons name="location" size={22} color="#21B086" />
          <Text style={styles.addressText}>
            {ecoponto?.endereco ||
              'Avenida Paulista, 1230 - Piso Térreo, Bela Vista, São Paulo - SP, CEP 01310-100'}
          </Text>
        </View>

        {/* Seção: Materiais Aceitos */}
        <Text style={styles.sectionHeader}>MATERIAIS ACEITOS</Text>
        <Text style={styles.bodyText}>
          {ecoponto?.materiaisAceitos || 'Informações em breve.'}
        </Text>

        {/* Seção: Horário de Funcionamento */}
        <Text style={styles.sectionHeader}>HORÁRIO DE FUNCIONAMENTO 📅</Text>
        {ecoponto?.horarios?.map((horario: string, index: number) => (
          <Text key={index} style={styles.scheduleText}>
            {horario}
          </Text>
        ))}

        {/* Seção: Regras de Descarte */}
        <Text style={[styles.sectionHeader, { marginTop: 22 }]}>
          REGRAS DE DESCARTE ⚠️
        </Text>
        <View style={styles.rulesRow}>
          {ecoponto?.regras?.map((regra: string, index: number) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleText}>{regra}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  circleTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: width * 0.78,
    height: 230,
    borderRadius: 150,
    backgroundColor: '#95DFC9',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -85,
    left: -55,
    width: width * 0.88,
    height: 310,
    borderRadius: 180,
    backgroundColor: '#21B086',
  },
  topHeader: {
    position: 'absolute',
    top: 40,
    left: 18,
    right: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  iconButton: {
    padding: 8,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 175,
    paddingBottom: 40,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  imageContainer: {
    width: width * 0.78,
    maxWidth: 340,
    height: 165,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  ecopontoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#000000',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  addressCard: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF9',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    gap: 10,
  },
  addressText: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionHeader: {
    color: '#21B086',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  bodyText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 330,
    marginBottom: 20,
  },
  scheduleText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  rulesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    marginTop: 6,
    gap: 8,
  },
  ruleItem: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
});
