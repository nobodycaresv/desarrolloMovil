import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header superior */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nosotros</Text>
        <Text style={styles.headerSubtitle}>Te contamos un poco de nuestra historia.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Logo / Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/Logo_RosarioEstetica.jpg')} 
            style={styles.logoImage}
            resizeMode="contain" 
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Desde</Text>
            <Text style={styles.statValueRed}>2024</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Rosario de</Text>
            <Text style={styles.statValueRed}>Lerma</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Lavadero &</Text>
            <Text style={styles.statValueRed}>Detailing</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={18} color="#BD201B" />
            <Text style={styles.cardTitle}>Nuestra Historia:</Text>
          </View>
          <Text style={styles.cardText}>
            Rosario Estética Vehicular nació el 13 de noviembre de 2024 como un emprendimiento personal en una casa familiar de Rosario de Lerma. Empezamos con un lavadero con servicios básicos y gracias a la demanda de los clientes y la capacitación de nuestro equipo, hoy somos un taller de detallado automotriz.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="star-four-points" size={18} color="#BD201B" />
            <Text style={styles.cardTitle}>Qué hacemos:</Text>
          </View>
          <Text style={styles.cardText}>
            Limpieza profunda, restauracion y conservación de la estética de tu vehículo, con técnicas especializadas y productos de calidad.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="pen" size={14} color="#BD201B" />
            <Text style={styles.cardTitle}>Nuestra Promesa:</Text>
          </View>
          <Text style={styles.cardText}>
            Cuidamos la estética de tu auto: una inversión segura.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItemActive}>
          <Ionicons name="home" size={20} color="#BD201B" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="sparkles-outline" size={20} color="#888" />
          <Text style={styles.navText}>Servicios</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="calendar-outline" size={20} color="#888" />
          <Text style={styles.navText}>Reservar</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 45,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },

  logoImage: {
    width: 260,
    height: 100,
    resizeMode: 'contain',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  statBox: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#BD201B',
    borderRadius: 10,
    width: '31%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  statTitle: {
    color: '#CCCCCC',
    fontSize: 11,
    textAlign: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statValueRed: {
    color: '#BD201B',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardText: {
    color: '#AAAAAA',
    fontSize: 12,
    lineHeight: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#222',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navTextActive: {
    color: '#BD201B',
    fontSize: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },
  navText: {
    color: '#888888',
    fontSize: 10,
    marginTop: 2,
  },
});