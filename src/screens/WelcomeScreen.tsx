// src/screens/WelcomeScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { OrganicHeader } from '../components/OrganicHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { COLORS, BORDER_RADIUS, COMMON_STYLES } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OrganicHeader height={230} />

      <View style={styles.content}>
        <View style={[styles.logoBox, COMMON_STYLES.shadowMd]}>
          <View style={styles.logoInnerCircle}>
            <MaterialCommunityIcons name="sprout" size={56} color="#6EE7B7" />
          </View>
        </View>

        <Text style={styles.appName}>ReciclaSpot</Text>
        <Text style={styles.welcomeTitle}>BEM VINDO AO MOVIMENTO 💚</Text>
        <Text style={styles.subtitle}>Seu descarte certo transforma o planeta 🌎.</Text>

        <View style={[styles.infoCard, COMMON_STYLES.shadowSm]}>
          <Text style={styles.infoCardText}>
            Encontre ecopontos por proximidade, consulte locais offline e registre seu impacto positivo na comunidade.
          </Text>
        </View>

        <PrimaryButton title="Começar aqui" onPress={() => navigation.navigate('Voluntario')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, marginTop: -60, zIndex: 10 },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 34,
    backgroundColor: COLORS.darkBrand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#284652',
  },
  logoInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0F2933',
    borderWidth: 3,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { color: COLORS.primary, fontSize: 30, fontWeight: '700', marginBottom: 14 },
  welcomeTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', textAlign: 'center', maxWidth: 280, marginBottom: 24 },
  infoCard: { width: '100%', maxWidth: 400, backgroundColor: '#8ADAC1', borderRadius: BORDER_RADIUS.md, padding: 20, marginBottom: 34 },
  infoCardText: { color: COLORS.surface, fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 21 },
});
