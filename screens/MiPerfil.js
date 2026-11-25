import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BarraInferior from '../components/BarraInferior';

export default function MiPerfil({ navigation }) {
  // Modelo de datos preparado para conectar con Firebase / Firestore
  const [perfil, setPerfil] = useState({
    nombreCompleto: 'Jorge Sanchez',
    telefono: '+54 387 555 0182',
    fechaRegistro: 'Desde 12 marzo 2024',
    miembroDesdeTexto: 'Cliente desde marzo de 2024',
    nivel: 'BLACK',
  });

  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  const historialServicios = [
    {
      id: '1',
      titulo: 'Detailing Exterior',
      fecha: '14 Abr 2026 · Toyota Hilux',
      precio: '$46.000',
      estado: 'COMPLETO',
    },
    {
      id: '2',
      titulo: 'Lavado Premium',
      fecha: '02 Abr 2026 · Toyota Hilux',
      precio: '$18.500',
      estado: 'COMPLETO',
    },
  ];

  const obtenerIniciales = (nombre) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  };

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sesión cerrada', 'Aquí se ejecutará signOut(auth) al integrar Firebase.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi perfil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditarPerfil', {
                perfilActual: perfil,
                onGuardar: (nuevosDatos) => setPerfil((prev) => ({ ...prev, ...nuevosDatos })),
              })
            }
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Tarjeta principal de usuario */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{obtenerIniciales(perfil.nombreCompleto)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{perfil.nombreCompleto}</Text>
            <Text style={styles.userSubtitle}>{perfil.miembroDesdeTexto}</Text>
            <View style={styles.badgeBlack}>
              <Text style={styles.badgeBlackText}>{perfil.nivel}</Text>
            </View>
          </View>
        </View>

        {/* Información del cliente */}
        <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#E50914" style={styles.rowIcon} />
            <View>
              <Text style={styles.infoLabel}>Nombre completo</Text>
              <Text style={styles.infoValue}>{perfil.nombreCompleto}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#E50914" style={styles.rowIcon} />
            <View>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{perfil.telefono}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#E50914" style={styles.rowIcon} />
            <View>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{perfil.fechaRegistro}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRowBetween}>
            <View style={styles.infoRowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#E50914" style={styles.rowIcon} />
              <View>
                <Text style={styles.infoLabel}>Notificaciones</Text>
                <Text style={styles.infoValue}>
                  {notificacionesActivas ? 'Recordatorios activados' : 'Recordatorios desactivados'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificacionesActivas}
              onValueChange={setNotificacionesActivas}
              trackColor={{ false: '#3A3A3C', true: '#E50914' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Historial reciente */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>HISTORIAL RECIENTE</Text>
          <TouchableOpacity onPress={() => Alert.alert('Historial', 'Aquí se conectará la vista de historial completo.')}>
            <Text style={styles.linkText}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {historialServicios.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconBox}>
                <MaterialCommunityIcons name="car-wash" size={22} color="#E50914" />
              </View>
              <View>
                <Text style={styles.historyTitle}>{item.titulo}</Text>
                <Text style={styles.historyDate}>{item.fecha}</Text>
              </View>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyPrice}>{item.precio}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{item.estado}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Ajustes y navegación */}
        <Text style={styles.sectionTitle}>AJUSTES</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Mis vehículos', 'Conectar con la pantalla de vehículos del compañero.')}
          >
            <View style={styles.infoRowLeft}>
              <Ionicons name="car-sport-outline" size={20} color="#FFFFFF" style={styles.rowIcon} />
              <Text style={styles.menuText}>Mis vehículos</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('Contacto')}
          >
            <View style={styles.infoRowLeft}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" style={styles.rowIcon} />
              <Text style={styles.menuText}>Contactanos</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={manejarCerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color="#E50914" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <BarraInferior activa="Perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  editButton: {
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  userCard: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 24,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  userInfo: { flex: 1 },
  userName: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  userSubtitle: { color: '#9A9AA0', fontSize: 13, marginTop: 2, marginBottom: 8 },
  badgeBlack: {
    alignSelf: 'flex-start',
    backgroundColor: '#E50914',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeBlackText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  linkText: { color: '#E50914', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 20,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  infoRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  infoRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 14 },
  infoLabel: { color: '#8E8E93', fontSize: 12 },
  infoValue: { color: '#FFFFFF', fontSize: 15, fontWeight: '500', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#262629', marginVertical: 10 },
  historyCard: {
    backgroundColor: '#161618',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262629',
    marginBottom: 12,
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  historyIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  historyDate: { color: '#8E8E93', fontSize: 12, marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyPrice: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  statusBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: { color: '#34C759', fontSize: 10, fontWeight: '700' },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  menuText: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    borderWidth: 1,
    borderColor: '#E50914',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 6,
  },
  logoutText: { color: '#E50914', fontSize: 16, fontWeight: '700' },
});
