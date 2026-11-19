import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from './voluntario';

interface PerfilScreenProps {
  usuario?: Usuario;
}

const STORAGE_DESCARTE_KEY = '@reciclaspot:descarte_perfil';

export default function PerfilScreen({ usuario }: PerfilScreenProps) {
  const navigation = useNavigation<any>();
  const nomeUsuario = usuario?.nome || 'Fulano de Tal';

  const [descartesCount, setDescartesCount] = useState<number>(3);
  const [fotoDescarteUri, setFotoDescarteUri] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);

  // Carrega a última foto e o contador salvos localmente (funciona 100% offline)
  useEffect(() => {
    const carregarDadosLocais = async () => {
      try {
        const salvo = await AsyncStorage.getItem(STORAGE_DESCARTE_KEY);
        if (salvo) {
          const { count, uri } = JSON.parse(salvo);
          if (typeof count === 'number') setDescartesCount(count);
          if (uri) setFotoDescarteUri(uri);
        }
      } catch (error) {
        console.error('Erro ao ler dados locais do perfil:', error);
      }
    };

    carregarDadosLocais();
  }, []);

  const abrirCameraNativa = async () => {
    setCameraLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Ative a permissão de câmera nas configurações para comprovar o descarte no ecoponto.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect:[4,3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const novaUri = result.assets[0].uri;
        const novoTotal = descartesCount + 1;

        setFotoDescarteUri(novaUri);
        setDescartesCount(novoTotal);

        await AsyncStorage.setItem(
          STORAGE_DESCARTE_KEY,
          JSON.stringify({ count: novoTotal, uri: novaUri })
        );

        Alert.alert('Comprovante salvo!', 'Foto do descarte registrada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao capturar/salvar foto:', error);
      Alert.alert('Erro na câmera', 'Não foi possível capturar ou salvar a foto agora.');
    } finally {
      setCameraLoading(false);
    }
  };

    const handleRegistrarNovoDescarte = () => {
    if (Platform.OS === 'web') {
      const confirmar = window.confirm(
        'Deseja abrir a câmera para fotografar o material entregue no ecoponto?'
      );
      if (confirmar) {
        abrirCameraNativa();
      }
      return;
    }

    Alert.alert(
      'Registrar Descarte',
      'Deseja abrir a câmera para fotografar o material entregue no ecoponto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Câmera', onPress: abrirCameraNativa },
      ]
    );
  };


  const formattedCount = String(descartesCount).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.headerContainer}>
          <View style={styles.circleDarkGreen} />
          <View style={styles.circleLightGreen} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
          >
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>

            <Text style={styles.userName}>{nomeUsuario}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Descartes conscientes:</Text>

          <Text style={styles.counterText}>{formattedCount}</Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={handleRegistrarNovoDescarte}
            disabled={cameraLoading}
          >
            {cameraLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                Registrar foto de novo{'\n'}descarte
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {fotoDescarteUri ? (
            <View>
              <Text style={styles.previewLabel}>Último comprovante de descarte:</Text>
              <Image
                source={{ uri: fotoDescarteUri }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={[styles.bannerImage, styles.placeholderBox]}>
              <Text style={styles.placeholderText}>
                Nenhuma foto registrada ainda.{'\n'}Toque no botão acima ao entregar seu resíduo no ecoponto.
              </Text>
            </View>
          )}
        </View>
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
      paddingBottom: 24,
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
    profileRow: {
      zIndex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 28,
    },
    avatarCircle: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      marginRight: 16,
    },
    avatarHead: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#23B584',
      marginBottom: 4,
    },
    avatarBody: {
      width: 44,
      height: 24,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      backgroundColor: '#23B584',
    },
    userName: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
    },
    statsContainer: {
      alignItems: 'center',
      paddingHorizontal: 28,
      marginTop: 26,
    },
    statsTitle: {
      fontSize: 21,
      fontWeight: '700',
      color: '#23B584',
      textAlign: 'center',
    },
    counterText: {
      fontSize: 56,
      fontWeight: '800',
      color: '#111111',
      letterSpacing: 6,
      marginVertical: 20,
    },
    actionButton: {
      backgroundColor: '#23B584',
      paddingVertical: 12,
      paddingHorizontal: 36,
      borderRadius: 28,
      minHeight: 58,
      minWidth: 220,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 20,
    },
    imageContainer: {
      paddingHorizontal: 24,
      marginTop: 28,
    },
    previewLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: '#23B584',
      marginBottom: 8,
    },
    bannerImage: {
      width: '100%',
      height: 185,
      borderRadius: 20,
      backgroundColor: '#F2F7F5',
    },
    placeholderBox: {
      borderWidth: 1.5,
      borderColor: '#9CE0C9',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    placeholderText: {
      color: '#5C7A70',
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 19,
    },
  });

