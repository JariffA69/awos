import { db } from '@/config/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

const collectionRef = collection(db, 'inquilinos')

function normalizeInquilino(datos, isEditing = false) {
  const ahora = new Date().toISOString()
  return {
    nombre: datos.nombre || '',
    correo: datos.correo || '',
    telefono: datos.telefono || '',
    celular: datos.celular || '',
    fechaIngreso: datos.fechaIngreso || '',
    estado: datos.estado || 'activo',
    notas: datos.notas || '',
    creado: datos.creado || ahora,
    actualizado: ahora,
  }
}

export async function getInquilinos() {
  try {
    const snapshot = await getDocs(collectionRef)
    const inquilinos = []
    snapshot.forEach((docSnap) => inquilinos.push({ id: docSnap.id, ...docSnap.data() }))
    return inquilinos
  } catch (error) {
    console.error('[inquilinoService] Error en getInquilinos:', error)
    throw new Error('No se pudieron recuperar los inquilinos del servidor.')
  }
}

export async function getInquilino(id) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Inquilino con ID ${id} no encontrado.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[inquilinoService] Error en getInquilino(${id}):`, error)
    throw new Error(error.message || 'Error al obtener el inquilino.')
  }
}

export async function crearInquilino(datos) {
  try {
    const inquilino = normalizeInquilino(datos)
    const docRef = await addDoc(collectionRef, inquilino)
    return { id: docRef.id, ...inquilino }
  } catch (error) {
    console.error('[inquilinoService] Error en crearInquilino:', error)
    throw new Error('Error al guardar el inquilino.')
  }
}

export async function actualizarInquilino(id, datos) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    const inquilino = normalizeInquilino(datos, true)
    const { id: _, ...payload } = inquilino
    await updateDoc(docRef, payload)
    return { id, ...payload }
  } catch (error) {
    console.error(`[inquilinoService] Error en actualizarInquilino(${id}):`, error)
    throw new Error('Error al actualizar el inquilino.')
  }
}

export async function eliminarInquilino(id) {
  try {
    const docRef = doc(db, 'inquilinos', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[inquilinoService] Error en eliminarInquilino(${id}):`, error)
    throw new Error('Error al eliminar el inquilino.')
  }
}
