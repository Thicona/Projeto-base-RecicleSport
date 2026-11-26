// src/screens/VoluntarioScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Usuario } from '../types/usuario';
import { storageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';
import { OrganicHeader } from '../components/OrganicHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { COLORS, BORDER_RADIUS } from '../utils/theme';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Voluntario'>;
};

export default function VoluntarioScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastrarVoluntario = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha seu e-mail e senha para se tornar um voluntário.');
      return;
    }

    const novoVoluntario: Usuario = {
      id: 'vol-001',
      nome: email.split('@')[0],
      email: email.trim(),
      pontosReciclagem: 0,
    };

    await storageService.setItem(STORAGE_KEYS.USUARIO, novoVoluntario);
    navigation.replace('MainTabs', { usuario: novoVoluntario });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OrganicHeader height={160} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.brandCard}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="cover" />
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

          <PrimaryButton title="Cadastrar-se" onPress={handleCadastrarVoluntario} style={styles.button} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, marginTop: -40, zIndex: 10 },
  brandCard: {
    width: width * 0.62,
    backgroundColor: '#8CE3C6',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: { width: 125, height: 125, borderRadius: 26, backgroundColor: COLORS.darkBrand },
  brandTitle: { marginTop: 10, fontSize: 20, fontWeight: '700', color: COLORS.primaryDark },
  formCard: { width: '100%', backgroundColor: '#ACEAD5', borderRadius: BORDER_RADIUS.xl, padding: 24, alignItems: 'center' },
  formTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 20 },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#75C9AE',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  button: { marginTop: 8, width: '100%' },
});
