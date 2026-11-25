import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../src/config/theme';
import BarraInferior from '../components/BarraInferior';

const GRILLA_TURNOS = [
  { id: '1', hora: '08:30', disponible: true },
  { id: '2', hora: '09:30', disponible: false },
  { id: '3', hora: '10:30', disponible: true },
  { id: '4', hora: '11:30', disponible: true },
  { id: '5', hora: '14:00', disponible: false },
  { id: '6', hora: '15:00', disponible: true },
  { id: '7', hora: '16:30', disponible: true },
  { id: '8', hora: '18:00', disponible: false },
];

export default function Turnos({ route, navigation }) {
  const servicioElegido = route?.params?.servicio || 'Lavado & Detailing';
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [vehiculo, setVehiculo] = useState('');

  const handleDemostracion = () => {
    const slot = GRILLA_TURNOS.find((item) => item.id === turnoSeleccionado);
    Alert.alert(
      'Demostración de vista',
      `Servicio: ${servicioElegido}\nHorario: ${slot ? `${slot.hora} hs` : 'Sin elegir'}\nVehículo: ${vehiculo.trim() || 'Sin dato'}\n\nPantalla no funcional (sin conexión ni .env).`
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={({ pressed }) => [
            styles.botonVolver,
            pressed && styles.presionado,
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titulosHeader}>
          <Text style={styles.titulo}>Turnos</Text>
          <Text style={styles.subtitulo}>Grilla de turnos (solo demostración)</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tarjetaServicio}>
          <Text style={styles.etiquetaRoja}>SERVICIO SELECCIONADO</Text>
          <Text style={styles.nombreServicio}>{servicioElegido}</Text>
        </View>

        <Text style={styles.etiquetaCampo}>Vehículo / observación (solo vista)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Gol Trend - AA 123 BB"
          placeholderTextColor={colors.textMuted}
          value={vehiculo}
          onChangeText={setVehiculo}
        />

        <Text style={styles.etiquetaCampo}>Grilla de horarios</Text>
        <View style={styles.grilla}>
          {GRILLA_TURNOS.map((turno) => {
            const estaSeleccionado = turnoSeleccionado === turno.id;
            const noDisponible = !turno.disponible;

            return (
              <Pressable
                key={turno.id}
                disabled={noDisponible}
                onPress={() => setTurnoSeleccionado(turno.id)}
                android_ripple={{ color: colors.primaryDark }}
                style={({ pressed }) => [
                  styles.celdaTurno,
                  noDisponible && styles.celdaOcupada,
                  estaSeleccionado && styles.celdaSeleccionada,
                  pressed && !noDisponible && styles.presionado,
                ]}
              >
                <Text
                  style={[
                    styles.horaTexto,
                    noDisponible && styles.textoOcupado,
                    estaSeleccionado && styles.textoSeleccionado,
                  ]}
                >
                  {turno.hora} hs
                </Text>
                <Text
                  style={[
                    styles.estadoTexto,
                    noDisponible && styles.textoOcupado,
                    estaSeleccionado && styles.textoSeleccionado,
                  ]}
                >
                  {noDisponible ? 'Ocupado' : estaSeleccionado ? 'Seleccionado' : 'Disponible'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleDemostracion}
          android_ripple={{ color: colors.primaryDark }}
          style={({ pressed }) => [
            styles.botonAccion,
            pressed && styles.presionado,
          ]}
        >
          <Text style={styles.textoBoton}>Vista previa (sin funcionalidad)</Text>
        </Pressable>
      </ScrollView>
      <BarraInferior activa="Reservar" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 45,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg + 4,
    marginBottom: spacing.md,
  },
  botonVolver: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titulosHeader: {
    flex: 1,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  contenido: {
    paddingHorizontal: spacing.lg + 4,
    paddingBottom: 40,
  },
  tarjetaServicio: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderRed,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  etiquetaRoja: {
    color: colors.textRed,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.6,
  },
  nombreServicio: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
  etiquetaCampo: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: borderRadius.md,
    height: 48,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.lg,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  celdaTurno: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  celdaOcupada: {
    backgroundColor: colors.inputBg,
    borderColor: colors.borderInput,
    opacity: 0.55,
  },
  celdaSeleccionada: {
    backgroundColor: colors.primary,
    borderColor: colors.borderRed,
  },
  horaTexto: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  estadoTexto: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  textoOcupado: {
    color: colors.textMuted,
  },
  textoSeleccionado: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  botonAccion: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  textoBoton: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  presionado: {
    opacity: 0.7,
  },
});