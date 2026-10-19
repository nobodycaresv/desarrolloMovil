import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function Home() {

  const handleCerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.contenedorGeneral}>
      {/* Header superior */}
      <View style={styles.encabezado}>
        <View style={styles.contenedorTitulosEncabezado}>
          <Text style={styles.tituloEncabezado}>Nosotros</Text>
          <Text style={styles.subtituloEncabezado}>Te contamos un poco de nuestra historia.</Text>
        </View>

        <TouchableOpacity style={styles.botonSalir} onPress={handleCerrarSesion}>
          <Ionicons name="log-out-outline" size={24} color="#BD201B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollPantalla} showsVerticalScrollIndicator={false}>

        {/* Logo de nuestra empresa*/}
        <View style={styles.contenedorLogo}>
          <Image 
            source={require('../assets/Logo_RosarioEstetica.jpg')} 
            style={styles.imagenLogo}
            resizeMode="contain" 
          />
        </View>
        
        <View style={styles.contenedor3Estadisticas}>
          <View style={styles.tarjetaEstadistica}>
            <Text style={styles.tituloEstadistica}>Desde</Text>
            <Text style={styles.valorEstadisticaRed}>2024</Text>
          </View>
          <View style={styles.tarjetaEstadistica}>
            <Text style={styles.tituloEstadistica}>Rosario de</Text>
            <Text style={styles.valorEstadisticaRed}>Lerma</Text>
          </View>
          <View style={styles.tarjetaEstadistica}>
            <Text style={styles.tituloEstadistica}>Lavadero &</Text>
            <Text style={styles.valorEstadisticaRed}>Detailing</Text>
          </View>
        </View>

        <View style={styles.tarjetaInformacion}>
          <View style={styles.encabezadoTarjeta}>
            <Ionicons name="time-outline" size={18} color="#BD201B" />
            <Text style={styles.tituloTarjeta}>Nuestra Historia:</Text>
          </View>
          <Text style={styles.parrafoTarjeta}>
            Rosario Estética Vehicular nació el 13 de noviembre de 2024 como un emprendimiento personal en una casa familiar de Rosario de Lerma. Empezamos con un lavadero con servicios básicos y gracias a la demanda de los clientes y la capacitación de nuestro equipo, hoy somos un taller de detallado automotriz.
          </Text>
        </View>

        <View style={styles.tarjetaInformacion}>
          <View style={styles.encabezadoTarjeta}>
            <MaterialCommunityIcons name="star-four-points" size={18} color="#BD201B" />
            <Text style={styles.tituloTarjeta}>Qué hacemos:</Text>
          </View>
          <Text style={styles.parrafoTarjeta}>
            Limpieza profunda, restauracion y conservación de la estética de tu vehículo, con técnicas especializadas y productos de calidad.
          </Text>
        </View>

        <View style={styles.tarjetaInformacion}>
          <View style={styles.encabezadoTarjeta}>
            <FontAwesome5 name="pen" size={14} color="#BD201B" />
            <Text style={styles.tituloTarjeta}>Nuestra Promesa:</Text>
          </View>
          <Text style={styles.parrafoTarjeta}>
            Cuidamos la estética de tu auto: una inversión segura.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.barraMenuInferior}>
        <View style={styles.menuSeleccionado}>
          <Ionicons name="home" size={20} color="#BD201B" />
          <Text style={styles.textoMenuSeleccionado}>Inicio</Text>
        </View>
        <View style={styles.tarjetaMenu}>
          <Ionicons name="sparkles-outline" size={20} color="#888" />
          <Text style={styles.textoTarjetaMenu}>Servicios</Text>
        </View>
        <View style={styles.tarjetaMenu}>
          <Ionicons name="calendar-outline" size={20} color="#888" />
          <Text style={styles.textoTarjetaMenu}>Reservar</Text>
        </View>
        <View style={styles.tarjetaMenu}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <Text style={styles.textoTarjetaMenu}>Perfil</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorGeneral: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 45,
  },

  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  contenedorTitulosEncabezado: {
    flex: 1,
  },

  botonSalir: {
    padding: 8,
  },
 

  tituloEncabezado: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtituloEncabezado: {
    color: '#888888',
    fontSize: 13,
  },

  scrollPantalla: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  contenedorLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },

  imagenLogo: {
    width: 260,
    height: 100,
    resizeMode: 'contain',
  },

  contenedor3Estadisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  tarjetaEstadistica: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#BD201B',
    borderRadius: 10,
    width: '31%',
    paddingVertical: 12,
    alignItems: 'center',
  },

  tituloEstadistica: {
    color: '#CCCCCC',
    fontSize: 11,
    textAlign: 'center',
  },

  valorEstadisticaRed: {
    color: '#BD201B',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },

  tarjetaInformacion: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },

  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  tituloTarjeta: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  parrafoTarjeta: {
    color: '#AAAAAA',
    fontSize: 12,
    lineHeight: 18,
  },

  barraMenuInferior: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#222',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  menuSeleccionado: {
    alignItems: 'center',
  },

  tarjetaMenu: {
    alignItems: 'center',
  },

  textoMenuSeleccionado: {
    color: '#BD201B',
    fontSize: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },

  textoTarjetaMenu: {
    color: '#888888',
    fontSize: 10,
    marginTop: 2,
  },


});