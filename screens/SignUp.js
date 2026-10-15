import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
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

  // Estado para guardar los errores específicos de cada campo y generales
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState('');

  // Función de registro integrada con validaciones en línea y Firebase
  const handleSignUp = async () => {
    let newErrors = {};
    setFirebaseError('');

    // 1. Validaciones inline con las Regex importadas
    if (!validateName(firstName)) {
      newErrors.firstName = 'Ingresa un nombre válido (mínimo 2 letras y solo texto).';
    }

    if (!validateName(lastName)) {
      newErrors.lastName = 'Ingresa un apellido válido (mínimo 2 letras y solo texto).';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!validatePhone(phone)) {
      newErrors.phone = 'Ingresa un número de teléfono válido.';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // Si existen errores, se guardan y se interrumpe el registro
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
      if (error.code === 'auth/email-already-in-use') {
        setFirebaseError('El correo electrónico ya está registrado.');
      } else if (error.code === 'auth/invalid-email') {
        setFirebaseError('El correo electrónico no es válido.');
      } else {
        setFirebaseError('Ocurrió un error al registrarse. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            
            {/* Botón Volver */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Encabezado */}
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Completa los datos para registrarte</Text>

            {/* Error General de Firebase */}
            {firebaseError ? (
              <Text style={styles.globalErrorText}>{firebaseError}</Text>
            ) : null}

            {/* Formulario */}
            <View style={styles.formGroup}>
              
              {/* Nombre */}
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Ingresa tu Nombre"
                placeholderTextColor="#666666"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) setErrors({ ...errors, firstName: null });
                }}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

              {/* Apellido */}
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Ingresa tu Apellido"
                placeholderTextColor="#666666"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) setErrors({ ...errors, lastName: null });
                }}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

              {/* Correo Electrónico */}
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Ingresa tu Correo"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Teléfono */}
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888888" style={styles.iconLeft} />
                <TextInput
                  style={[styles.input, styles.inputWithLeftIcon, errors.phone && styles.inputError]}
                  placeholder="Ingresa tu Teléfono"
                  placeholderTextColor="#666666"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              {/* Contraseña */}
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.inputWithRightIcon, errors.password && styles.inputError]}
                  placeholder="Ingresa tu Contraseña"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
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
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirmar Contraseña */}
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.inputWithRightIcon, errors.confirmPassword && styles.inputError]}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
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
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              {/* Botón Registrarse */}
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
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
  inputError: {
    borderColor: '#FF3B30', // Rojo de alerta para campos inválidos
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  globalErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
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