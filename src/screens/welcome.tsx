import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const handleStart = () => {
    navigation.navigate('Voluntario');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>

      <View style={styles.circleTopRight} />
      <View style={styles.circleTopLeft} />

      <View style={styles.content}>
        <View style={styles.logoBox}>
          <View style={styles.logoInnerCircle}>
            <MaterialCommunityIcons name="sprout" size={56} color="#6EE7B7" />
          </View>
        </View>

        <Text style={styles.appName}>ReciclaSpot</Text>

        <Text style={styles.welcomeTitle}>BEM VINDO AO MOVIMENTO 💚</Text>

        <Text style={styles.subtitle}>
          Seu descarte certo transforma o planeta 🌎.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardText}>
            Encontre ecopontos por proximidade, consulte locais offline e registre seu impacto positivo na comunidade.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Começar aqui</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    right: -50,
    width: width * 0.78,
    height: 260,
    borderRadius: 150,
    backgroundColor: '#95DFC9',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -90,
    left: -60,
    width: width * 0.9,
    height: 340,
    borderRadius: 180,
    backgroundColor: '#21B086',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    zIndex: 10,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 34,
    backgroundColor: '#13222A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#284652',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
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
  appName: {
    color: '#21B086',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  welcomeTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
    marginBottom: 24,
  },
  infoCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#8ADAC1',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 21,
  },
  button: {
    backgroundColor: '#21B086',
    paddingVertical: 15,
    paddingHorizontal: 42,
    borderRadius: 12,
    shadowColor: '#21B086',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
