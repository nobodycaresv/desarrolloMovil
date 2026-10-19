import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, ScrollView, Platform, // Para que el teclado no tape el campo
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Respeta la zona segura (notch, barra de estado)
import { Ionicons } from '@expo/vector-icons'; // Íconos (flecha atrás, sobre)
import { sendPasswordResetEmail } from 'firebase/auth'; // Función de Firebase que envía el correo de recuperación
import { auth } from '../src/config/firebaseConfig'; // Conexión a Firebase
// Estilos compartidos del grupo (tema de Mati): colores, tamaños y estilos de campo y botón
import {
  colors, typography, spacing, inputStyles, buttonStyles,
} from '../src/config/theme';
// Validación de correo compartida (la hizo Mario)
import { validateEmail } from '../src/utils/validations';

// Mensaje único: se muestra exista o no la cuenta, para no revelar qué correos están registrados
const MENSAJE_CONFIRMACION =
  'Se ha enviado un enlace a su correo. Si su cuenta existe, recibirá las instrucciones para reestablecer su contraseña. Por favor, revise su bandeja de entrada y la casilla de spam.';

export default function ForgotPassword({ navigation }) {
  // Estados de la pantalla
  const [email, setEmail] = useState('');        // lo que escribe el usuario
  const [touched, setTouched] = useState(false); // true cuando ya salió del campo (para mostrar el error recién ahí)
  const [loading, setLoading] = useState(false); // true mientras se envía (evita doble toque)

  const emailValido = validateEmail(email.trim());
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
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView: sube el contenido cuando aparece el teclado */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView: permite desplazarse si el contenido no entra en pantalla */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Los botones responden al primer toque aunque haya teclado
          showsVerticalScrollIndicator={false}
        >
          {/* Botón para volver a la pantalla anterior (si no hay una, va a Login) */}
          <TouchableOpacity style={styles.backButton} onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Login'))}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Encabezado */}
          <Text style={styles.title}>Recuperar contraseña</Text>
          <Text style={styles.subtitle}>
            Ingrese su correo y le enviaremos un enlace para restablecerla
          </Text>

          {/* Campo: correo (el estilo viene del tema; si hay error se pinta el borde de rojo) */}
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={[inputStyles.container, mostrarError && styles.inputError]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <TextInput
              style={inputStyles.input}
              placeholder="Ingresa tu correo"
              placeholderTextColor={colors.textMuted}
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

          {/* Botón ENVIAR: apagado hasta que el correo sea válido (estilo del tema) */}
          <TouchableOpacity
            style={[buttonStyles.primary, (!emailValido || loading) && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={!emailValido || loading}
          >
            <Text style={buttonStyles.primaryText}>ENVIAR</Text>
          </TouchableOpacity>

          {/* Link para volver al inicio de sesión */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Solo estilos propios de esta pantalla; el resto sale de theme.js
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, // fondo negro
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1, // flexGrow (y no flex) permite desplazarse si no entra todo
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  backButton: { marginTop: spacing.lg, marginBottom: spacing.sm, width: 40 },
  title: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
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
  inputError: { borderColor: colors.borderRed },                       // borde rojo cuando el correo es inválido
  errorText: { color: colors.textRed, fontSize: typography.fontSize.sm, marginLeft: spacing.sm },
  buttonDisabled: { opacity: 0.5 },                                    // botón atenuado cuando está deshabilitado
  linkText: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.md },
});