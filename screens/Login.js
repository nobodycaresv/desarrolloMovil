import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
// Estilos compartidos del grupo (colores, tamaños, campos y botones)
import { colors, typography, spacing, inputStyles, buttonStyles, } from '../src/config/theme';

const MAX_CORREO = 30;   // máximo estándar de un correo
const MIN_CONTRASENA = 6; // Firebase no admite contraseñas más cortas

const estaVacio = (valor) => valor.trim().length === 0;

const tieneFormatoBasico = (correo) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(correo.trim());

const validarCorreo = (correo) => {
  if (estaVacio(correo)) return 'El correo electrónico es obligatorio.';
  if (correo.trim().length > MAX_CORREO) return 'El correo es demasiado largo.';
  if (!tieneFormatoBasico(correo)) return 'Por favor, ingrese un correo válido.';
  return '';
};

const validarContrasena = (contrasena) => {
  if (estaVacio(contrasena)) return 'La contraseña es obligatoria.';
  if (contrasena.length < MIN_CONTRASENA) return `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`;
  return '';
};

// Mensaje único para cualquier fallo de credenciales (no revela qué correos existen)
const MENSAJE_CREDENCIALES = 'Credenciales inválidas. Por favor, verifique su correo y contraseña.';
const MENSAJE_CONEXION = 'Error de conexión, por favor intente más tarde.';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({ correo: '', contrasena: '' });
  const [errorServidor, setErrorServidor] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false); // evita doble toque mientras se autentica
  // Recordar Contraseña. Solo se tilda, no guarda la contraseña.
  const [recordar, setRecordar] = useState(false);

  // El botón se habilita solo cuando ambos campos son completados
  const formularioCompleto = !estaVacio(correo) && !estaVacio(contrasena);

  // Al escribir se limpian los errores para que el usuario corrija
  const manejarCambioCorreo = (texto) => {
    setCorreo(texto);
    if (errores.correo) setErrores((prev) => ({ ...prev, correo: '' }));
    if (errorServidor) setErrorServidor('');
  };

  const manejarCambioContrasena = (texto) => {
    setContrasena(texto);
    if (errores.contrasena) setErrores((prev) => ({ ...prev, contrasena: '' }));
    if (errorServidor) setErrorServidor('');
  };

  // Al salir de un campo se valida
  const manejarBlurCorreo = () => setErrores((prev) => ({ ...prev, correo: validarCorreo(correo) }));
  const manejarBlurContrasena = () => setErrores((prev) => ({ ...prev, contrasena: validarContrasena(contrasena) }));

  const manejarIngresar = async () => {
    if (loading) return;

    // Si hay errores en el cliente, no se llama al servidor
    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena),
    };
    setErrores(nuevosErrores);
    setErrorServidor('');
    if (nuevosErrores.correo || nuevosErrores.contrasena) return;

    setLoading(true);
    try {
      // No se navega aquí: Navigation.js escucha la sesión (onAuthStateChanged)
      await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        setErrorServidor(MENSAJE_CONEXION);
      } else {
        setErrorServidor(MENSAJE_CREDENCIALES);
      }
    } finally {
      setLoading(false);
    }
  };

  const botonDeshabilitado = !formularioCompleto || loading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={require('../assets/logo-rosario.png')} style={styles.logo} />
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingrese su correo y contraseña para continuar</Text>

          {errorServidor ? <Text style={styles.errorServidor}>{errorServidor}</Text> : null}

          <Text style={styles.label}>Correo electrónico</Text>
          <View style={[inputStyles.container, errores.correo ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={inputStyles.input}
              placeholder="Ingresa tu correo"
              placeholderTextColor={colors.textMuted}
              value={correo}
              onChangeText={manejarCambioCorreo}
              onBlur={manejarBlurCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              maxLength={MAX_CORREO}
            />
          </View>
          {errores.correo ? <Text style={styles.errorText}>{errores.correo}</Text> : null}

          <Text style={styles.label}>Contraseña</Text>
          <View style={[inputStyles.container, errores.contrasena ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={inputStyles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={colors.textMuted}
              value={contrasena}
              onChangeText={manejarCambioContrasena}
              onBlur={manejarBlurContrasena}
              secureTextEntry={!mostrarContrasena}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
            />
            {/* Ojo para mostrar u ocultar la contraseña */}
            <TouchableOpacity
              onPress={() => setMostrarContrasena((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <Ionicons
                name={mostrarContrasena ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errores.contrasena ? <Text style={styles.errorText}>{errores.contrasena}</Text> : null}

          {/* CAMBIO 4: casilla "Recordar contraseña" (solo visual) */}
          <TouchableOpacity
            style={styles.recordarContainer}
            onPress={() => setRecordar((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: recordar }}
          >
            <Ionicons
              name={recordar ? 'checkbox' : 'square-outline'}
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.recordarText}>Recordar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primary, botonDeshabilitado && styles.buttonDisabled]}
            onPress={manejarIngresar}
            disabled={botonDeshabilitado}
            accessibilityRole="button"
            accessibilityState={{ disabled: botonDeshabilitado }}
          >
            <Text style={buttonStyles.primaryText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>¿No tienes cuenta aún? Regístrate</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Solo estilos propios de esta pantalla; el resto sale de theme.js
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1, // permite scroll si el contenido no entra en pantalla
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 40,
  },
  title: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  icon: { marginRight: spacing.sm },
  inputError: { borderColor: colors.borderRed },
  errorText: {
    color: colors.textRed,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.sm,
  },
  errorServidor: {
    color: colors.textRed,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: { opacity: 0.5 },
  recordarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  recordarText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    marginLeft: spacing.sm,
  },
  linkText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  logo: {
    width: 220,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
});