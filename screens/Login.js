import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

export default function Login({ navigation }) {

//validacion del cliente 

// Validación de espacio
const estaVacio = (valor) => valor.trim().length === 0;

// Validación de @ y .com
const tieneFormatoBasico = (correo) => {
  const texto = correo.trim();
  return texto.includes('@') && texto.includes('.com');
};

const validarCorreo = (correo) => {
  if (estaVacio(correo)) return 'El correo electrónico es obligatorio';
  if (!tieneFormatoBasico(correo)) return 'Por favor, ingrese un correo válido';
  return '';
};

const validarContrasena = (contrasena) => {
  if (estaVacio(contrasena)) return 'La contraseña es obligatoria';
  return '';
};

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({ correo: '', contrasena: '' });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  // Aqui el botón esta deshabilitado hasta que se complete todo
  const formularioCompleto = !estaVacio(correo) && !estaVacio(contrasena);

  const manejarCambioCorreo = (texto) => {
    setCorreo(texto);
    // Limpia el error mientras el cliente corrige.
    if (errores.correo) setErrores((prev) => ({ ...prev, correo: '' }));
  };

  const manejarCambioContrasena = (texto) => {
    setContrasena(texto);
    if (errores.contrasena) setErrores((prev) => ({ ...prev, contrasena: '' }));
  };

  const manejarIngresar = () => {
    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena),
    };
    setErrores(nuevosErrores);

    // Si hay algún error, no se continúa.
    if (nuevosErrores.correo || nuevosErrores.contrasena) return;

    //aca se conecta al Firebase Authentication que seria la validación del servidor.
    console.log('Validación del cliente superada:', {
      correo: correo.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Iniciar sesión</Text>
        <Text style={styles.subtitulo}>
          Ingrese su correo y contraseña para continuar.
        </Text>

        {/* Correo electrónico */}
        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, errores.correo ? styles.inputError : null]}
            value={correo}
            onChangeText={manejarCambioCorreo}
            placeholder="nombre@gmail.com"
            placeholderTextColor="#9AA0A6"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          {errores.correo ? (
            <Text style={styles.textoError}>{errores.correo}</Text>
          ) : null}
        </View>

        {/* Contraseña */}
        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Contraseña</Text>
          <View
            style={[
              styles.filaContrasena,
              errores.contrasena ? styles.inputError : null,
            ]}
          >
            <TextInput
              style={styles.inputContrasena}
              value={contrasena}
              onChangeText={manejarCambioContrasena}
              placeholder="Tu contraseña"
              placeholderTextColor="#9AA0A6"
              secureTextEntry={!mostrarContrasena}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setMostrarContrasena((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={
                mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              <Text style={styles.textoMostrar}>
                {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          {errores.contrasena ? (
            <Text style={styles.textoError}>{errores.contrasena}</Text>
          ) : null}
        </View>

        {/* Botón Ingresar */}
        <TouchableOpacity
          style={[styles.boton, !formularioCompleto && styles.botonDeshabilitado]}
          onPress={() =>navigation.navigate('Home')}
          disabled={!formularioCompleto}
          accessibilityRole="button"
          accessibilityState={{ disabled: !formularioCompleto }}
        >
          <Text style={styles.textoBoton}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonOlvidaste}
          onPress={() => navigation.navigate('ForgotPassword')}
          accessibilityRole="button"
          accessibilityLabel="Recuperar contraseña"
        > 
        <Text style={styles.textoOlvidaste}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// paleta de colores 
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  contenedor: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: '#B3B3B3',
    marginBottom: 28,
  },
  grupo: {
    marginBottom: 18,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
  filaContrasena: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1A1A1A',
  },
  inputContrasena: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
  },
  textoMostrar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4D4D',
    paddingLeft: 12,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  textoError: {
    marginTop: 6,
    fontSize: 13,
    color: '#FF4D4D',
  },
  boton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#D62828',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
    botonOlvidaste: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  textoOlvidaste: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4D4D',
    textDecorationLine: 'underline',
  },
});
