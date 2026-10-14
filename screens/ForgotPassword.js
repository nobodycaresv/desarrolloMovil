import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
  KeyboardAvoidingView, ScrollView, Platform, // Para que el teclado no tape el campo
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Íconos (sobre)
import { sendPasswordResetEmail } from 'firebase/auth'; // Función de Firebase que envía el correo de recuperación
import { auth } from '../src/config/firebaseConfig'; // Conexión a Firebase

// Están acá adentro para que esta pantalla no dependa de otros archivos.
const colors = {
  background: '#000000', // Negro institucional
  primary: '#BD201B',    // Rojo Rosario (botón y línea del campo)
  text: '#FFFFFF',       // Blanco
  muted: '#C8C8C8',      // Gris metálico (ícono, placeholder, links)
  error: '#FF5A5A',      // Rojo claro para errores, legible sobre negro
};

// Cuando la dupla suba utils/validations.js, borrar esta función y usar:
// import { validarEmail } from '../utils/validations';
// Comprueba que el correo tenga formato válido (ejemplo@dominio.com)
const validarEmail = (v) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v.trim());

// Mensaje único: se muestra exista o no la cuenta, para no revelar qué correos están registrados
const MENSAJE_CONFIRMACION =
  'Se ha enviado un enlace a su correo. Si su cuenta existe, recibirá las instrucciones para reestablecer su contraseña. Por favor, revise su bandeja de entrada y la casilla de spam.';

export default function ForgotPassword({ navigation }) {
  // Estados de la pantalla
  const [email, setEmail] = useState('');       // lo que escribe el usuario
  const [touched, setTouched] = useState(false); // true cuando ya salió del campo (para mostrar el error recién ahí)
  const [loading, setLoading] = useState(false); // true mientras se envía (evita doble toque)

  const emailValido = validarEmail(email);
  // Se muestra el error solo si ya salió del campo, escribió algo y el formato es incorrecto
  const mostrarError = touched && email.length > 0 && !emailValido;

  // Se ejecuta al apretar "ENVIAR"
  const handleSend = async () => {
    if (!emailValido || loading) return; // seguridad extra: no hace nada si es inválido
    setLoading(true);
    try {
      // Le pide a Firebase que mande el correo para restablecer la contraseña
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Correo enviado', MENSAJE_CONFIRMACION);
      setEmail('');
      setTouched(false);
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        // Falla de internet: no tiene que ver con la cuenta, así que se avisa aparte
        Alert.alert('Error', 'Error de conexión, por favor intente más tarde.');
      } else {
        // Cualquier otro caso (incluido "usuario no existe") muestra el MISMO mensaje
        Alert.alert('Correo enviado', MENSAJE_CONFIRMACION);
        setEmail('');
        setTouched(false);
      }
    } finally {
      setLoading(false); // vuelve a habilitar el botón
    }
  };

  return (
    // KeyboardAvoidingView: sube el contenido cuando aparece el teclado
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ScrollView: permite desplazarse si el contenido no entra en pantalla */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Los botones responden al primer toque aunque haya teclado
        showsVerticalScrollIndicator={false}
      >
        {/* Logo de Rosario Estética Vehicular */}
        <Image source={require('../assets/logo-rosario.png')} style={styles.logo} />
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingrese su correo y le enviaremos un enlace para restablecerla.
        </Text>

        {/* Campo: correo */}
        <Text style={styles.label}>Correo</Text>
        <View style={[styles.inputContainer, mostrarError && styles.inputError]}>
          <FontAwesome name="envelope" size={20} color={colors.muted} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched(true)} // Valida al salir del campo
            keyboardType="email-address"    // Teclado con @
            autoCapitalize="none"           // No pone mayúscula al inicio
            autoCorrect={false}
          />
        </View>
        {/* Mensaje de error bajo el campo (solo si el formato es incorrecto) */}
        {mostrarError && (
          <Text style={styles.errorText}>Por favor, ingrese un formato de correo válido.</Text>
        )}

        {/* Botón ENVIAR: apagado hasta que el correo sea válido */}
        <TouchableOpacity
          style={[styles.button, (!emailValido || loading) && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={!emailValido || loading}
        >
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>

        {/* Link para volver al inicio de sesión */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Fondo negro detrás de todo (evita que se vea blanco al subir el teclado)
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  // flexGrow (y no flex) permite que el contenido se desplace si no entra
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: { width: 220, height: 110, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: colors.text },
  subtitle: { textAlign: 'center', color: colors.muted, marginBottom: 10 },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: colors.text,
  },
  // Fila del campo: ícono + texto + línea roja abajo
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.primary,
    marginBottom: 6,
    width: '100%',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40, color: colors.text }, // Texto escrito en blanco
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  linkText: { marginTop: 20, color: colors.muted },

  // Estilos propios de esta función
  inputError: { borderColor: colors.error },                                       // línea del campo en rojo claro si hay error
  errorText: { alignSelf: 'flex-start', color: colors.error, fontSize: 13, marginBottom: 10 }, // texto del error
  buttonDisabled: { opacity: 0.5 },                                                // botón atenuado cuando está deshabilitado
});
