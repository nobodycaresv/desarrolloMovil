import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../src/config/firebaseConfig';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import ForgotPassword from '../screens/ForgotPassword';
import Servicios from '../screens/Servicios';
import Turnos from '../screens/Turnos';
import MiPerfil from '../screens/MiPerfil';
import EditarPerfil from '../screens/EditarPerfil';
import Contacto from '../screens/Contacto';
import ContactoConsulta from '../screens/ContactoConsulta';
import ConsultaEnviada from '../screens/ConsultaEnviada';

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Falta configurar Firebase. Copia .env.example como .env y completa los datos de tu proyecto.
        </Text>
      </View>
    );
  }

  if (user === undefined) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Servicios" component={Servicios} />
            <Stack.Screen name="Turnos" component={Turnos} />
            <Stack.Screen name="MiPerfil" component={MiPerfil} />
            <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
            <Stack.Screen name="Contacto" component={Contacto} />
            <Stack.Screen name="ContactoConsulta" component={ContactoConsulta} />
            <Stack.Screen name="ConsultaEnviada" component={ConsultaEnviada} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { textAlign: 'center', fontSize: 16 },
});