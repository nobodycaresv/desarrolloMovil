import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig'; // Ruta ajustada a tu carpeta src
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword
} from '../src/utils/validations'; // Ruta exacta según tu estructura de carpetas

export default function SignUp({ navigation }) {
  // Estados para los campos del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para alternar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función de registro integrada con validaciones y Firebase
  const handleSignUp = async () => {
    // 1. Validaciones con las Regex importadas de src/utils/validations.js
    if (!validateName(firstName)) {
      Alert.alert('Error', 'Por favor ingresa un nombre válido (mínimo 2 letras y solo texto).');
      return;
    }

    if (!validateName(lastName)) {
      Alert.alert('Error', 'Por favor ingresa un apellido válido (mínimo 2 letras y solo texto).');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // 2. Registro de usuario en Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Guardar nombre y apellido en el perfil del usuario de Firebase
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`
        });
      }

      Alert.alert('¡Éxito!', 'Cuenta creada correctamente.');
      // Si usas navegación:
      // navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      let errorMessage = 'Ocurrió un error al registrarse.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está registrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      }
      Alert.alert('Error de registro', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Encabezado */}
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Completa los datos para registrarte</Text>

        {/* Formulario */}
        <View style={styles.formGroup}>
          
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu Nombre"
            placeholderTextColor="#666666"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu Apellido"
            placeholderTextColor="#666666"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu Correo"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#888888" style={styles.iconLeft} />
            <TextInput
              style={[styles.input, styles.inputWithLeftIcon]}
              placeholder="Ingresa tu Teléfono"
              placeholderTextColor="#666666"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputWithRightIcon]}
              placeholder="Ingresa tu Contraseña"
              placeholderTextColor="#666666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#888888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputWithRightIcon]}
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#666666"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#888888"
              />
            </TouchableOpacity>
          </View>

          {/* Botón Registrarse (Rojo Rosario #BD201B) */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Negro Institucional
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#C8C8C8', // Gris Metálico
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 5,
  },
  formGroup: {
    width: '100%',
  },
  label: {
    color: '#C8C8C8',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#BD201B', // Rojo Rosario
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 44,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  iconLeft: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 14,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#BD201B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});