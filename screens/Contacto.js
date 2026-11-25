import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Contacto({ navigation }) {
  const canalesContacto = [
    {
      id: 'whatsapp',
      titulo: 'WhatsApp',
      valor: '+54 387 654 4790',
      icono: <FontAwesome name="whatsapp" size={22} color="#25D366" />,
      onPress: () => Linking.openURL('https://wa.me'),
    },
    {
      id: 'instagram',
      titulo: 'Instagram',
      valor: '@Rosario.Estetica.Vehicular',
      icono: <FontAwesome name="instagram" size={22} color="#E1306C" />,
      onPress: () => Linking.openURL('https://instagram.com'),
    },
    {
      id: 'email',
      titulo: 'Correo Electrónico',
      valor: 'RosarioEstetica@gmail.com',
      icono: <Ionicons name="mail-outline" size={22} color="#E50914" />,
      onPress: () => Linking.openURL('mailto:RosarioEstetica@gmail.com'),
    },
    {
      id: 'horarios',
      titulo: 'Horarios de atención',
      valor: 'Lunes a Sabados - 09:30 a 19:30',
      icono: <Ionicons name="time-outline" size={22} color="#E50914" />,
      onPress: null,
    },
    {
      id: 'direccion',
      titulo: 'Dirección',
      valor: 'Islas Malvinas 750 - Rosario de Lerma',
      icono: <Ionicons name="location-outline" size={22} color="#E50914" />,
      onPress: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.title}>Contactanos</Text>
          <Text style={styles.subtitle}>Rosario de Lerma, Salta</Text>
        </View>

        {/* Tarjetas informativas */}
        {canalesContacto.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.infoCard}
            activeOpacity={item.onPress ? 0.7 : 1}
            onPress={item.onPress}
          >
            <View style={styles.iconContainer}>{item.icono}</View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardValue}>{item.valor}</Text>
            </View>
            {item.onPress && <Ionicons name="open-outline" size={18} color="#8E8E93" />}
          </TouchableOpacity>
        ))}

        {/* Botones inferiores */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ContactoConsulta')}
        >
          <Text style={styles.primaryButtonText}>Realizar una consulta</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.secondaryButtonText}>Volver atras</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginTop: 10, marginBottom: 24 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#E50914', fontSize: 14, fontWeight: '600', marginTop: 4 },
  infoCard: {
    backgroundColor: '#161618',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1F1F23',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  cardTitle: { color: '#8E8E93', fontSize: 12, fontWeight: '600' },
  cardValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 2 },
  primaryButton: {
    backgroundColor: '#E50914',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
