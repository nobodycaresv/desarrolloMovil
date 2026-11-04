import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity, Modal, Alert,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  collection, onSnapshot, orderBy, query, addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';
import { colors, typography, spacing, borderRadius, inputStyles, buttonStyles } from '../src/config/theme';
import BarraInferior from '../components/BarraInferior';

const VACIO = { nombre: '', descripcion: '', precio: '', duracion: '', imagen: '' };
// Firestore limita cada documento a 1 MiB, por eso se rechazan imágenes muy pesadas
const MAX_IMAGEN = 700000;

// Cada validador devuelve el mensaje de error, o '' si el campo está bien
const validadores = {
  nombre: (v) => (v.trim().length >= 3 && v.trim().length <= 40 ? '' : 'El nombre debe tener entre 3 y 40 caracteres.'),
  descripcion: (v) => (v.trim().length >= 1 && v.trim().length <= 120 ? '' : 'La descripción es obligatoria (máximo 120 caracteres).'),
  precio: (v) => (Number(v.replace(',', '.')) > 0 ? '' : 'Ingresá un precio mayor a 0.'),
  duracion: (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 600 ? '' : 'La duración debe ser un entero entre 1 y 600 minutos.';
  },
  imagen: (v) => (v ? '' : 'Elegí una imagen.'),
};

export default function Servicios({ navigation }) {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // null = creando
  const [aEliminar, setAEliminar] = useState(null);   // servicio a borrar

  // Escucha la colección: la lista se actualiza sola al crear, editar o eliminar
  useEffect(() => {
    const q = query(collection(db, 'servicios'), orderBy('nombre'));
    return onSnapshot(
      q,
      (snap) => {
        setServicios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCargando(false);
      },
      () => setCargando(false)
    );
  }, []);

  const abrirNuevo = () => {
    setForm(VACIO);
    setErrores({});
    setEditandoId(null);
    setModalVisible(true);
  };

  const abrirEditar = (item) => {
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: String(item.precio),
      duracion: String(item.duracion),
      imagen: item.imagen || '',
    });
    setErrores({});
    setEditandoId(item.id);
    setModalVisible(true);
  };

  // Al escribir: actualiza el campo y limpia su error
  const cambiar = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: valor }));
    if (errores[campo]) setErrores((p) => ({ ...p, [campo]: '' }));
  };

  // Al salir de un campo: lo valida
  const validarCampo = (campo) => setErrores((p) => ({ ...p, [campo]: validadores[campo](form[campo]) }));

  const elegirImagen = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });
    if (r.canceled) return;
    const b64 = r.assets[0].base64;
    if (!b64 || b64.length > MAX_IMAGEN) {
      setErrores((p) => ({ ...p, imagen: 'La imagen es muy pesada, elegí otra.' }));
      return;
    }
    cambiar('imagen', `data:image/jpeg;base64,${b64}`);
  };

  const guardar = async () => {
    // Al guardar se validan todos los campos juntos
    const nuevos = {};
    Object.keys(validadores).forEach((c) => (nuevos[c] = validadores[c](form[c])));
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;

    setGuardando(true);
    try {
      const datos = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio.replace(',', '.')),
        duracion: Number(form.duracion),
        imagen: form.imagen,
      };
      if (editandoId) await updateDoc(doc(db, 'servicios', editandoId), datos);
      else await addDoc(collection(db, 'servicios'), datos);
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el servicio. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    try {
      await deleteDoc(doc(db, 'servicios', aEliminar.id));
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar el servicio.');
    } finally {
      setAEliminar(null);
    }
  };

  // Campo de texto con etiqueta y mensaje de error, con el estilo global de los inputs
  const campo = (clave, etiqueta, props = {}) => (
    <>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={[inputStyles.container, errores[clave] ? styles.campoConError : null]}>
        <TextInput
          style={inputStyles.input}
          placeholderTextColor={colors.textMuted}
          value={form[clave]}
          onChangeText={(t) => cambiar(clave, t)}
          onBlur={() => validarCampo(clave)}
          {...props}
        />
      </View>
      {errores[clave] ? <Text style={styles.textoError}>{errores[clave]}</Text> : null}
    </>
  );

  if (cargando) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} size="large" color={colors.primary} />;
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Servicios</Text>

        <TouchableOpacity style={buttonStyles.primary} onPress={abrirNuevo}>
          <Text style={buttonStyles.primaryText}>+ Nuevo servicio</Text>
        </TouchableOpacity>

        <FlatList
          data={servicios}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          ListEmptyComponent={<Text style={styles.vacio}>No hay servicios cargados.</Text>}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              {item.imagen ? <Image source={{ uri: item.imagen }} style={styles.tarjetaFoto} /> : null}
              <View style={styles.tarjetaInfo}>
                <Text style={styles.tarjetaNombre}>{item.nombre}</Text>
                <Text style={styles.tarjetaDetalle}>{item.descripcion}</Text>
                <Text style={styles.tarjetaDetalle}>$ {item.precio} · {item.duracion} min</Text>
              </View>
              <View style={styles.tarjetaAcciones}>
                <TouchableOpacity onPress={() => abrirEditar(item)}>
                  <Text style={styles.accionEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAEliminar(item)}>
                  <Text style={styles.accionEliminar}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal: crear / editar */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalCaja}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>{editandoId ? 'Editar servicio' : 'Nuevo servicio'}</Text>
              {campo('nombre', 'Nombre', { placeholder: 'Ej: Lavado completo' })}
              {campo('descripcion', 'Descripción', { placeholder: 'Qué incluye' })}
              {campo('precio', 'Precio', { keyboardType: 'numeric', placeholder: '15000' })}
              {campo('duracion', 'Duración (minutos)', { keyboardType: 'numeric', placeholder: '60' })}

              <Text style={styles.etiqueta}>Imagen</Text>
              <TouchableOpacity style={styles.botonImagen} onPress={elegirImagen}>
                <Text style={styles.botonImagenTexto}>{form.imagen ? 'Cambiar imagen' : 'Elegir imagen'}</Text>
              </TouchableOpacity>
              {form.imagen ? <Image source={{ uri: form.imagen }} style={styles.vistaPrevia} /> : null}
              {errores.imagen ? <Text style={styles.textoError}>{errores.imagen}</Text> : null}

              <TouchableOpacity
                style={[buttonStyles.primary, guardando && { opacity: 0.5 }]}
                onPress={guardar}
                disabled={guardando}
              >
                <Text style={buttonStyles.primaryText}>{guardando ? 'Guardando…' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={guardando}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal: confirmar eliminación */}
      <Modal visible={!!aEliminar} transparent animationType="fade" onRequestClose={() => setAEliminar(null)}>
        <View style={styles.confirmarFondo}>
          <View style={styles.confirmarCaja}>
            <Text style={styles.modalTitulo}>¿Eliminar servicio?</Text>
            <Text style={styles.confirmarTexto}>Se va a borrar "{aEliminar?.nombre}". No se puede deshacer.</Text>
            <TouchableOpacity style={buttonStyles.primary} onPress={eliminar}>
              <Text style={buttonStyles.primaryText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAEliminar(null)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BarraInferior activa="Servicios" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Pantalla
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { flex: 1, paddingTop: 56, paddingHorizontal: spacing.lg },
  titulo: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  vacio: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },

  // Tarjeta de cada servicio
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tarjetaFoto: { width: 64, height: 64, borderRadius: borderRadius.sm, marginRight: spacing.md },
  tarjetaInfo: { flex: 1 },
  tarjetaNombre: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  tarjetaDetalle: { fontSize: typography.fontSize.md, color: colors.textSecondary, marginTop: 2 },
  tarjetaAcciones: { justifyContent: 'space-between', alignItems: 'flex-end', marginLeft: spacing.sm },
  accionEditar: { color: colors.textPrimary, fontWeight: typography.fontWeight.bold },
  accionEliminar: { color: colors.textRed, fontWeight: typography.fontWeight.bold },

  // Modal de crear / editar
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCaja: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalTitulo: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  etiqueta: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  campoConError: { borderColor: colors.borderRed },
  textoError: { color: colors.textRed, fontSize: typography.fontSize.xs, marginLeft: spacing.sm },
  botonImagen: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  botonImagenTexto: { color: colors.primary, fontWeight: typography.fontWeight.bold },
  vistaPrevia: { width: 120, height: 120, borderRadius: borderRadius.md, marginTop: spacing.md, alignSelf: 'center' },
  textoCancelar: { textAlign: 'center', color: colors.textSecondary, marginBottom: spacing.sm },

  // Modal de confirmación
  confirmarFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: spacing.xl },
  confirmarCaja: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
  },
  confirmarTexto: { color: colors.textSecondary, marginVertical: spacing.sm },
});