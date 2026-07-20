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

const collectionRef = collection(db, 'propiedades')

function normalizePropiedad(datos) {
  const ahora = new Date().toISOString()
  return {
    idUbicacion: datos.idUbicacion || '',
    idInquilino: datos.idInquilino || '',
    numero: datos.numero || '',
    piso: Number.isFinite(Number(datos.piso)) ? Number(datos.piso) : 0,
    metrosCuadrados: Number(datos.metrosCuadrados) || 0,
    habitaciones: Number(datos.habitaciones) || 0,
    banos: Number(datos.banos) || 0,
    rentaMensual: Number(datos.rentaMensual) || 0,
    estado: Number(datos.estado) || 1,
    tipo: datos.tipo || 'departamento',
    notas: datos.notas || '',
    creado: datos.creado || ahora,
    actualizado: ahora,
  }
}

export async function getPropiedades() {
  try {
    const snapshot = await getDocs(collectionRef)
    const propiedades = []
    snapshot.forEach((docSnap) => propiedades.push({ id: docSnap.id, ...docSnap.data() }))
    return propiedades
  } catch (error) {
    console.error('[propiedadService] Error en getPropiedades:', error)
    throw new Error('No se pudieron recuperar las propiedades del servidor.')
  }
}

export async function getPropiedad(id) {
  try {
    const docRef = doc(db, 'propiedades', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Propiedad con ID ${id} no encontrada.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[propiedadService] Error en getPropiedad(${id}):`, error)
    throw new Error(error.message || 'Error al obtener la propiedad.')
  }
}

export async function crearPropiedad(datos) {
  try {
    const propiedad = normalizePropiedad(datos)
    const docRef = await addDoc(collectionRef, propiedad)
    return { id: docRef.id, ...propiedad }
  } catch (error) {
    console.error('[propiedadService] Error en crearPropiedad:', error)
    throw new Error('Error al guardar la propiedad.')
  }
}

export async function actualizarPropiedad(id, datos) {
  try {
    const docRef = doc(db, 'propiedades', id)
    const propiedad = normalizePropiedad(datos)
    const { id: _, ...payload } = propiedad
    await updateDoc(docRef, payload)
    return { id, ...payload }
  } catch (error) {
    console.error(`[propiedadService] Error en actualizarPropiedad(${id}):`, error)
    throw new Error('Error al actualizar la propiedad.')
  }
}

export async function eliminarPropiedad(id) {
  try {
    const docRef = doc(db, 'propiedades', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[propiedadService] Error en eliminarPropiedad(${id}):`, error)
    throw new Error('Error al eliminar la propiedad.')
  }
}
