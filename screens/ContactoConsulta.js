import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SERVICIOS = [
  'Lavado Premium',
  'Detailing Exterior',
  'Limpieza de Interior',
  'Tratamiento Cerámico',
  'Otro servicio',
];

export default function ContactoConsulta({ navigation }) {
  // Modelo de datos de la consulta preparado para guardar en Firestore
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState('Lavado Premium');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const manejarEnviar = () => {
    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !mensaje.trim()) {
      Alert.alert('Faltan datos', 'Por favor completa todos los campos para enviar tu consulta.');
      return;
    }

    const payloadConsulta = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      servicio: servicioSeleccionado,
      mensaje: mensaje.trim(),
      fechaCreacion: new Date().toISOString(),
    };

    // Aquí tu compañero puede guardar payloadConsulta en Firestore (colección "consultas")
    navigation.navigate('ConsultaEnviada', { consulta: payloadConsulta });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Escribinos</Text>
        <Text style={styles.subtitle}>Completá el formulario y te respondemos a la brevedad</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#636366"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu apellido"
            placeholderTextColor="#636366"
            value={apellido}
            onChangeText={setApellido}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+54 387 ..."
            placeholderTextColor="#636366"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />

          <Text style={styles.label}>Servicio de interés</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setMostrarOpciones(!mostrarOpciones)}
          >
            <Text style={styles.selectorText}>{servicioSeleccionado}</Text>
            <Ionicons
              name={mostrarOpciones ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {mostrarOpciones && (
            <View style={styles.dropdown}>
              {SERVICIOS.map((serv) => (
                <TouchableOpacity
                  key={serv}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setServicioSeleccionado(serv);
                    setMostrarOpciones(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      serv === servicioSeleccionado && { color: '#E50914', fontWeight: '700' },
                    ]}
                  >
                    {serv}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Mensaje</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribí tu consulta o detalle del vehículo..."
            placeholderTextColor="#636366"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={mensaje}
            onChangeText={setMensaje}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={manejarEnviar}>
          <Text style={styles.primaryButtonText}>Enviar consulta</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
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
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 10 },
  subtitle: { color: '#8E8E93', fontSize: 14, marginTop: 4, marginBottom: 20 },
  formCard: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 20,
  },
  label: { color: '#A1A1AA', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: '#0D0D0F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  selector: {
    backgroundColor: '#0D0D0F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectorText: { color: '#FFFFFF', fontSize: 15 },
  dropdown: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 12,
    overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#262629' },
  dropdownText: { color: '#FFFFFF', fontSize: 14 },
  textArea: { height: 110, paddingTop: 12 },
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
