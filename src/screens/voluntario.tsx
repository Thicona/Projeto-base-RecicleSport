import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  pontosReciclagem: number;
  fotoPerfilUri?: string;
}

type VoluntarioScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Voluntario'>;
};

const VoluntarioScreen: React.FC<VoluntarioScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const handleCadastrarVoluntario = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha seu e-mail e senha para se tornar um voluntário.'
      );
      return;
    }

    const novoVoluntario: Usuario = {
      id: 'vol-001',
      nome: email.split('@')[0],
      email: email.trim(),
      pontosReciclagem: 0,
    };

    try {
      await AsyncStorage.setItem(
        '@reciclaspot:usuario',
        JSON.stringify(novoVoluntario)
      );
    } catch (error) {
      console.log('Erro ao salvar voluntário offline:', error);
    }

    navigation.replace('MainTabs', { usuario: novoVoluntario });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.topRightLightWave} />
        <View style={styles.topLeftDarkWave} />

        <View style={styles.brandCard}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.brandTitle}>ReciclaSpot</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Seja um voluntário</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#3B6E5C"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#3B6E5C"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleCadastrarVoluntario}
          >
            <Text style={styles.submitButtonText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VoluntarioScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  topLeftDarkWave: {
    position: 'absolute',
    top: -50,
    left: -45,
    width: width * 0.72,
    height: 310,
    backgroundColor: '#16A07A',
    borderBottomRightRadius: 180,
    borderBottomLeftRadius: 110,
  },
  topRightLightWave: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: width * 0.75,
    height: 220,
    backgroundColor: '#8CE3C6',
  },
  brandCard: {
    width: width * 0.62,
    backgroundColor: '#8CE3C6',
    borderRadius: 28,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  logoImage: {
    width: 135,
    height: 135,
    borderRadius: 26,
    backgroundColor: '#111D27',
  },
  brandTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#199A75',
    letterSpacing: 0.3,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#ACEAD5',
    borderRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#75C9AE',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 18,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#1A9A76',
    paddingVertical: 11,
    paddingHorizontal: 38,
    borderRadius: 22,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
