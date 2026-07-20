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

const collectionRef = collection(db, 'departamentos')

function normalizeDepartamento(datos, isEditing = false) {
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
    creado: isEditing ? datos.creado || ahora : datos.creado || ahora,
    actualizado: ahora,
  }
}

export async function getDepartamentos() {
  try {
    const snapshot = await getDocs(collectionRef)
    const departamentos = []
    snapshot.forEach((docSnap) => departamentos.push({ id: docSnap.id, ...docSnap.data() }))
    return departamentos
  } catch (error) {
    console.error('[departamentoService] Error en getDepartamentos:', error)
    throw new Error('No se pudieron recuperar los departamentos del servidor.')
  }
}

export async function getDepartamento(id) {
  try {
    const docRef = doc(db, 'departamentos', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error(`Departamento con ID ${id} no encontrado.`)
    }
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[departamentoService] Error en getDepartamento(${id}):`, error)
    throw new Error(error.message || 'Error al obtener el departamento.')
  }
}

export async function crearDepartamento(datos) {
  try {
    const departamento = normalizeDepartamento(datos)
    const docRef = await addDoc(collectionRef, departamento)
    return { id: docRef.id, ...departamento }
  } catch (error) {
    console.error('[departamentoService] Error en crearDepartamento:', error)
    throw new Error('Error al guardar el departamento.')
  }
}

export async function actualizarDepartamento(id, datos) {
  try {
    const docRef = doc(db, 'departamentos', id)
    const departamento = normalizeDepartamento(datos, true)
    const { id: _, ...payload } = departamento
    await updateDoc(docRef, payload)
    return { id, ...payload }
  } catch (error) {
    console.error(`[departamentoService] Error en actualizarDepartamento(${id}):`, error)
    throw new Error('Error al actualizar el departamento.')
  }
}

export async function eliminarDepartamento(id) {
  try {
    const docRef = doc(db, 'departamentos', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[departamentoService] Error en eliminarDepartamento(${id}):`, error)
    throw new Error('Error al eliminar el departamento.')
  }
}
