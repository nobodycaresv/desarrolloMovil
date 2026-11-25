import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultaEnviada({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Marca superior */}
        <Text style={styles.brand}>ROSARIO</Text>
        <Text style={styles.brandSub}>ESTÉTICA VEHICULAR</Text>

        {/* Centro de confirmación */}
        <View style={styles.centerBox}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Consulta enviada</Text>
          <Text style={styles.subtitle}>Gracias por escribirnos</Text>
        </View>

        {/* Botones de retorno */}
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Contacto')}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Volver a Contacto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('MiPerfil')}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryButtonText}>Volver a Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  content: { flex: 1, padding: 24, justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: 4, marginTop: 20 },
  brandSub: { color: '#E50914', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginTop: 2 },
  centerBox: { alignItems: 'center' },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#9A9AA0', fontSize: 16 },
  footerButtons: { width: '100%', marginBottom: 16 },
  primaryButton: {
    backgroundColor: '#E50914',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
