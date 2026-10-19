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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} from '../src/utils/validations';

export default function SignUp({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [isPassFocused, setIsPassFocused] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleBlur = (field) => {
    let errs = { ...errors };
    if (field === 'firstName' && !validateName(form.firstName)) {
      errs.firstName = 'Ingresa un nombre válido (mínimo 2 letras y solo texto).';
    } else if (field === 'lastName' && !validateName(form.lastName)) {
      errs.lastName = 'Ingresa un apellido válido (mínimo 2 letras y solo texto).';
    } else if (field === 'email' && !validateEmail(form.email)) {
      errs.email = 'Ingresa un correo electrónico válido.';
    } else if (field === 'phone' && !validatePhone(form.phone)) {
      errs.phone = 'Ingresa un número de teléfono válido.';
    } else {
      delete errs[field];
    }
    setErrors(errs);
  };

  const passRules = {
    length: form.password.length >= 6,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
  };

  const handleSignUp = async () => {
    let errs = {};
    setFirebaseError('');

    if (!validateName(form.firstName)) errs.firstName = 'Ingresa un nombre válido (mínimo 2 letras y solo texto).';
    if (!validateName(form.lastName)) errs.lastName = 'Ingresa un apellido válido (mínimo 2 letras y solo texto).';
    if (!validateEmail(form.email)) errs.email = 'Ingresa un correo electrónico válido.';
    if (!validatePhone(form.phone)) errs.phone = 'Ingresa un número de teléfono válido.';
    if (!validatePassword(form.password)) errs.password = 'La contraseña no cumple con los requisitos mínimos.';
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      if (cred.user) {
        await updateProfile(cred.user, {
          displayName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        });
      }
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente.');
      // Sin navegación a Home: la sesión pasa sola de forma global.
    } catch (error) {
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Completa los datos para registrarte
            </Text>

            {firebaseError ? (
              <Text style={styles.errorText}>{firebaseError}</Text>
            ) : null}

            <View style={styles.formGroup}>
              {[
                {
                  label: 'Nombre',
                  key: 'firstName',
                  placeholder: 'Ingresa tu Nombre',
                },
                {
                  label: 'Apellido',
                  key: 'lastName',
                  placeholder: 'Ingresa tu Apellido',
                },
                {
                  label: 'Correo Electrónico',
                  key: 'email',
                  placeholder: 'Ingresa tu Correo',
                  keyboard: 'email-address',
                  autoCap: 'none',
                },
                {
                  label: 'Teléfono',
                  key: 'phone',
                  placeholder: 'Ingresa tu Teléfono',
                  keyboard: 'phone-pad',
                  icon: 'call-outline',
                },
              ].map((item) => (
                <View key={item.key}>
                  <Text style={styles.label}>{item.label}</Text>
                  <View style={styles.inputContainer}>
                    {item.icon && (
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color="#888888"
                        style={styles.iconLeft}
                      />
                    )}
                    <TextInput
                      style={[
                        styles.input,
                        item.icon && styles.inputWithLeftIcon,
                        errors[item.key] && styles.inputError,
                      ]}
                      placeholder={item.placeholder}
                      placeholderTextColor="#666666"
                      value={form[item.key]}
                      onChangeText={(val) => updateField(item.key, val)}
                      onBlur={() => handleBlur(item.key)}
                      keyboardType={item.keyboard || 'default'}
                      autoCapitalize={item.autoCap || 'sentences'}
                    />
                  </View>
                  {errors[item.key] && (
                    <Text style={styles.errorText}>{errors[item.key]}</Text>
                  )}
                </View>
              ))}

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithRightIcon,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Ingresa tu Contraseña"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showPass.password}
                  value={form.password}
                  onChangeText={(val) => updateField('password', val)}
                  onFocus={() => setIsPassFocused(true)}
                  onBlur={() => setIsPassFocused(false)}
                />
                <TouchableOpacity
                  style={styles.iconRight}
                  onPress={() =>
                    setShowPass((p) => ({ ...p, password: !p.password }))
                  }
                >
                  <Ionicons
                    name={showPass.password ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#888888"
                  />
                </TouchableOpacity>
              </View>

              {isPassFocused && (
                <View style={styles.reqContainer}>
                  <Text
                    style={[
                      styles.reqText,
                      passRules.length && styles.reqValid,
                    ]}
                  >
                    • Al menos 6 caracteres
                  </Text>
                  <Text
                    style={[styles.reqText, passRules.upper && styles.reqValid]}
                  >
                    • Una letra mayúscula
                  </Text>
                  <Text
                    style={[styles.reqText, passRules.lower && styles.reqValid]}
                  >
                    • Una letra minúscula
                  </Text>
                  <Text
                    style={[styles.reqText, passRules.number && styles.reqValid]}
                  >
                    • Un número
                  </Text>
                </View>
              )}

              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithRightIcon,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showPass.confirm}
                  value={form.confirmPassword}
                  onChangeText={(val) => {
                    updateField('confirmPassword', val);
                    if (val !== form.password) {
                      setErrors((e) => ({
                        ...e,
                        confirmPassword: 'Las contraseñas no coinciden.',
                      }));
                    } else {
                      setErrors((e) => {
                        const copy = { ...e };
                        delete copy.confirmPassword;
                        return copy;
                      });
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.iconRight}
                  onPress={() =>
                    setShowPass((p) => ({ ...p, confirm: !p.confirm }))
                  }
                >
                  <Ionicons
                    name={showPass.confirm ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#888888"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

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
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { marginTop: 20, marginBottom: 10, width: 40 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#C8C8C8',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  formGroup: { width: '100%' },
  label: { color: '#C8C8C8', fontSize: 14, marginBottom: 6, marginTop: 12 },
  inputContainer: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#BD201B',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputError: { borderColor: '#FF3B30', borderWidth: 1.5 },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 4, marginLeft: 4 },
  inputWithLeftIcon: { paddingLeft: 44 },
  inputWithRightIcon: { paddingRight: 48 },
  iconLeft: { position: 'absolute', left: 14, zIndex: 1 },
  iconRight: { position: 'absolute', right: 14, zIndex: 1 },
  reqContainer: { marginTop: 6, marginBottom: 4, marginLeft: 4 },
  reqText: { color: '#888888', fontSize: 12 },
  reqValid: { color: '#34C759' },
  button: {
    backgroundColor: '#BD201B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});