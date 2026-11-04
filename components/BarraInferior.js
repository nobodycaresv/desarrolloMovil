import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/config/theme';

const ITEMS = [
    { clave: 'Home', texto: 'Inicio', on: 'home', off: 'home-outline' },
    { clave: 'Servicios', texto: 'Servicios', on: 'sparkles', off: 'sparkles-outline' },
    { clave: 'Reservar', texto: 'Reservar', on: 'calendar', off: 'calendar-outline' },
    { clave: 'Perfil', texto: 'Perfil', on: 'person', off: 'person-outline' },
];

export default function BarraInferior({ activa, navigation }) {
    const ir = (clave) => {
        if (clave === activa) return;
        if (clave === 'Home' || clave === 'Servicios') navigation.replace(clave);
        else Alert.alert('Próximamente', 'Esta sección todavía no está disponible.');
    };

    return (
    <View style={styles.barra}>
        {ITEMS.map((it) => {
        const activo = it.clave === activa;
        return (
            <TouchableOpacity key={it.clave} style={styles.item} onPress={() => ir(it.clave)}>
            <Ionicons name={activo ? it.on : it.off} size={20} color={activo ? colors.primary : '#888888'} />
            <Text style={[styles.texto, activo && styles.textoActivo]}>{it.texto}</Text>
            </TouchableOpacity>
        );
        })}
    </View>
    );
}

const styles = StyleSheet.create({
    barra: { flexDirection: 'row', backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: '#222', height: 60, alignItems: 'center' },
    item: { flex: 1, alignItems: 'center' },
    texto: { color: '#888888', fontSize: 10, marginTop: 2 },
    textoActivo: { color: colors.primary, fontWeight: 'bold' },
});