import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { obtenerTasaDolarPeso } from '../services/exchangeRateService'

export const useExchangeRateStore = defineStore('exchangeRate', () => {
    // Estados
    const tasa = ref(null)
    const cargando = ref(false)
    const error = ref('')
    const timestamp = ref(null)

    // Computadas
    const tiempoActualizacion = computed(() => {
        if (!timestamp.value) return 'Sin datos'
        const minutos = Math.floor((Date.now() - timestamp.value) / 60000)
        if (minutos < 1) return 'Hace menos de 1 minuto'
        if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
        const horas = Math.floor(minutos / 60)
        return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
    })

    // Acciones
    async function cargarTasa() {
        cargando.value = true
        error.value = ''
        try {
            const datos = await obtenerTasaDolarPeso()
            tasa.value = datos.tasa
            timestamp.value = datos.timestamp
            console.log('[SUCCESS] Tasa cargada: 1 USD = ' + datos.tasa + ' MXN')
        } catch (err) {
            error.value = err.message
            console.error('[ERROR]', err.message)
        } finally {
            cargando.value = false
        }
    }

    function limpiarError() {
        error.value = ''
    }

    // Exponer todo
    return {
        tasa,
        cargando,
        error,
        tiempoActualizacion,
        cargarTasa,
        limpiarError
    }
})
