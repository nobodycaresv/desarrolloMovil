import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditarPerfil({ navigation, route }) {
  const perfilActual = route?.params?.perfilActual || {
    nombreCompleto: 'Jorge Sanchez',
    telefono: '+54 387 555 0182',
  };

  const [nombreCompleto, setNombreCompleto] = useState(perfilActual.nombreCompleto);
  const [telefono, setTelefono] = useState(perfilActual.telefono);

  const manejarGuardar = () => {
    if (!nombreCompleto.trim() || !telefono.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa tu nombre y teléfono.');
      return;
    }

    if (route?.params?.onGuardar) {
      route.params.onGuardar({
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
      });
    }

    Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Cabecera */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <TouchableOpacity style={styles.checkBtn} onPress={manejarGuardar}>
            <Ionicons name="checkmark" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre completo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
              placeholder="Ej: Jorge Sanchez"
              placeholderTextColor="#636366"
            />
          </View>

          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Ej: +54 387 555 0182"
              placeholderTextColor="#636366"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Botón Guardar Cambios */}
        <TouchableOpacity style={styles.saveButton} onPress={manejarGuardar}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  content: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  iconBtn: {
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  checkBtn: {
    backgroundColor: '#E50914',
    padding: 10,
    borderRadius: 12,
  },
  formCard: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 24,
  },
  label: { color: '#A1A1AA', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D0F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 14 },
  saveButton: {
    backgroundColor: '#E50914',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
