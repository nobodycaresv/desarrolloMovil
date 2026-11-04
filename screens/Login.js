import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,Image,
  KeyboardAvoidingView, ScrollView, Platform, // Para que el teclado no tape los campos
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Respeta la zona segura (notch, barra de estado)
import { Ionicons } from '@expo/vector-icons'; // Íconos (sobre, candado, ojo)
import { signInWithEmailAndPassword } from 'firebase/auth'; // Función de Firebase que valida las credenciales
import { auth } from '../src/config/firebaseConfig'; // Conexión a Firebase
// Estilos compartidos del grupo: colores, tamaños y estilos de campo y botón
import {
  colors, typography, spacing, inputStyles, buttonStyles,
} from '../src/config/theme';

// no puede estar vacío ni tener solo espacios
const estaVacio = (valor) => valor.trim().length === 0;

// el correo debe contener '@' y '.'
const tieneFormatoBasico = (correo) => {
  const texto = correo.trim();
  return texto.includes('@') && texto.includes('.');
};

// Devuelven el mensaje de error, o '' si el campo es válido
const validarCorreo = (correo) => {
  if (estaVacio(correo)) return 'El correo electrónico es obligatorio.';
  if (!tieneFormatoBasico(correo)) return 'Por favor, ingrese un correo válido.';
  return '';
};

const validarContrasena = (contrasena) => {
  if (estaVacio(contrasena)) return 'La contraseña es obligatoria.';
  return '';
};

// Mensaje único para CUALQUIER fallo de autenticación (usuario inexistente, contraseña
// incorrecta, cuenta deshabilitada...)
const MENSAJE_CREDENCIALES = 'Credenciales inválidas. Por favor, verifique su correo y contraseña.';
const MENSAJE_CONEXION = 'Error de conexión, por favor intente más tarde.';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({ correo: '', contrasena: '' }); // errores por campo
  const [errorServidor, setErrorServidor] = useState('');                 // error devuelto por Firebase
  const [mostrarContrasena, setMostrarContrasena] = useState(false);      // ojo para ver/ocultar
  const [loading, setLoading] = useState(false);                          // true mientras se autentica (evita doble toque)

  // El botón "Ingresar" queda deshabilitado hasta que ambos campos estén completos
  const formularioCompleto = !estaVacio(correo) && !estaVacio(contrasena);

  // Al escribir se actualiza el valor y se limpian los errores para que el usuario corrija
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

  // Al salir de un campo se valida ese campo
  const manejarBlurCorreo = () => setErrores((prev) => ({ ...prev, correo: validarCorreo(correo) }));
  const manejarBlurContrasena = () => setErrores((prev) => ({ ...prev, contrasena: validarContrasena(contrasena) }));

  // Se ejecuta al apretar "INGRESAR"
  const manejarIngresar = async () => {
    if (loading) return;

    // Validación del cliente, si hay algún error, no se llama al servidor
    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena),
    };
    setErrores(nuevosErrores);
    setErrorServidor('');
    if (nuevosErrores.correo || nuevosErrores.contrasena) return;

    //Firebase Authentication comprueba correo y contraseña
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, correo.trim(), contrasena); // cambia de pantalla solo cuando el usuario inicia sesión.
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        setErrorServidor(MENSAJE_CONEXION);
      } else {
        setErrorServidor(MENSAJE_CREDENCIALES);
      }
    } finally {
      setLoading(false); // vuelve a habilitar el botón
    }
  };

  const botonDeshabilitado = !formularioCompleto || loading;

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView sube el contenido cuando aparece el teclado */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView permite desplazarse si el contenido no entra en pantalla */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Los botones responden al primer toque aunque haya teclado
          showsVerticalScrollIndicator={false}
        >
          <Image source={require('../assets/logo-rosario.png')} style={styles.logo} />
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingrese su correo y contraseña para continuar</Text>

          {/* Muestra error del sesrvidor */}
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
              onBlur={manejarBlurCorreo} // Valida al salir del campo
              keyboardType="email-address" // Teclado con @
              autoCapitalize="none"        // No pone mayúscula al inicio
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
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

          <TouchableOpacity
            style={[buttonStyles.primary, botonDeshabilitado && styles.buttonDisabled]}
            onPress={manejarIngresar}
            disabled={botonDeshabilitado}
            accessibilityRole="button"
            accessibilityState={{ disabled: botonDeshabilitado }}
          >
            <Text style={buttonStyles.primaryText}>INGRESAR</Text>
          </TouchableOpacity>

          {/* Links a las otras pantallas */}
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

// Aqui se ven los estilos de esta pantalla, el resto sale de theme.js
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, // fondo negro
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1, // flexGrow (y no flex) permite desplazarse si no entra todo
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
  inputError: { borderColor: colors.borderRed }, // borde rojo cuando el campo tiene error
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
  buttonDisabled: { opacity: 0.5 }, // botón atenuado cuando está deshabilitado
  linkText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
    logo: {
    width: 220,
    height: 110,          // respeta la proporción del archivo (725×360)
    resizeMode: 'contain', // no deforma ni recorta la imagen
    alignSelf: 'center',   // lo centra horizontalmente
    marginBottom: spacing.xl,
  },
});