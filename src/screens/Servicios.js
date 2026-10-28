import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity, Modal, Alert,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, onSnapshot, orderBy, query, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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

export default function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState(VACIO);
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);
    const [editandoId, setEditandoId] = useState(null);   // null = creando
    const [aEliminar, setAEliminar] = useState(null);     // servicio a borrar

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
    setModalVisible(true);
    setEditandoId(null);
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

const eliminar = async () => {
  try {
    await deleteDoc(doc(db, 'servicios', aEliminar.id));
  } catch (e) {
    Alert.alert('Error', 'No se pudo eliminar el servicio.');
  } finally {
    setAEliminar(null);
  }
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

  const campo = (clave, etiqueta, props = {}) => (
    <>
      <Text style={styles.label}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, errores[clave] ? styles.inputError : null]}
        value={form[clave]}
        onChangeText={(t) => cambiar(clave, t)}
        onBlur={() => validarCampo(clave)}
        {...props}
      />
      {errores[clave] ? <Text style={styles.error}>{errores[clave]}</Text> : null}
    </>
  );

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#BD201B" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios</Text>
      <TouchableOpacity style={styles.boton} onPress={abrirNuevo}>
        <Text style={styles.botonTexto}>+ Nuevo servicio</Text>
      </TouchableOpacity>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vacio}>No hay servicios cargados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imagen ? <Image source={{ uri: item.imagen }} style={styles.foto} /> : null}
            <View style={styles.info}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.detalle}>{item.descripcion}</Text>
              <Text style={styles.detalle}>$ {item.precio} · {item.duracion} min</Text>
            </View>
            <View style={styles.acciones}>
            <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.editar}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAEliminar(item)}>
                <Text style={styles.borrar}>Eliminar</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.fondoModal} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitulo}>{editandoId ? 'Editar servicio' : 'Nuevo servicio'}</Text>
              {campo('nombre', 'Nombre', { placeholder: 'Ej: Lavado completo' })}
              {campo('descripcion', 'Descripción', { placeholder: 'Qué incluye', multiline: true })}
              {campo('precio', 'Precio', { keyboardType: 'numeric', placeholder: '15000' })}
              {campo('duracion', 'Duración (minutos)', { keyboardType: 'numeric', placeholder: '60' })}

              <Text style={styles.label}>Imagen</Text>
              <TouchableOpacity style={styles.botonSecundario} onPress={elegirImagen}>
                <Text style={styles.botonSecundarioTexto}>{form.imagen ? 'Cambiar imagen' : 'Elegir imagen'}</Text>
              </TouchableOpacity>
              {form.imagen ? <Image source={{ uri: form.imagen }} style={styles.preview} /> : null}
              {errores.imagen ? <Text style={styles.error}>{errores.imagen}</Text> : null}

              <TouchableOpacity style={[styles.boton, guardando && { opacity: 0.5 }]} onPress={guardar} disabled={guardando}>
                <Text style={styles.botonTexto}>{guardando ? 'Guardando…' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} disabled={guardando}>
                <Text style={styles.cancelar}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
            <Modal visible={!!aEliminar} transparent animationType="fade" onRequestClose={() => setAEliminar(null)}>
        <View style={styles.centrado}>
          <View style={styles.confirmar}>
            <Text style={styles.modalTitulo}>¿Eliminar servicio?</Text>
            <Text style={{ marginVertical: 8 }}>Se va a borrar "{aEliminar?.nombre}". No se puede deshacer.</Text>
            <TouchableOpacity style={styles.boton} onPress={eliminar}>
              <Text style={styles.botonTexto}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAEliminar(null)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 56, paddingHorizontal: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    vacio: { textAlign: 'center', marginTop: 40, color: '#666' },
    card: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, marginBottom: 10 },
    foto: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
    info: { flex: 1 },
    nombre: { fontSize: 16, fontWeight: 'bold' },
    detalle: { color: '#444', marginTop: 2 },
    boton: { backgroundColor: '#BD201B', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginVertical: 12 },
    botonTexto: { color: '#fff', fontWeight: 'bold' },
    botonSecundario: { borderWidth: 1, borderColor: '#BD201B', borderRadius: 24, paddingVertical: 10, alignItems: 'center' },
    botonSecundarioTexto: { color: '#BD201B', fontWeight: 'bold' },
    fondoModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
    modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    label: { marginTop: 12, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
    inputError: { borderColor: '#BD201B' },
    error: { color: '#BD201B', fontSize: 12, marginTop: 4 },
    preview: { width: 120, height: 120, borderRadius: 10, marginTop: 10, alignSelf: 'center' },
    cancelar: { textAlign: 'center', color: '#666', marginBottom: 8 },
    acciones: { justifyContent: 'space-between', alignItems: 'flex-end' },
    editar: { color: '#1a5fb4', fontWeight: 'bold' },
    borrar: { color: '#BD201B', fontWeight: 'bold' },
    centrado: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    confirmar: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
});