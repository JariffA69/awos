import axios from 'axios'

const BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

/**
 * Obtener el tipo de cambio de USD a MXN
 * @returns {promise<{tasa: number, fecha: string}>}
 */
export async function obtenerTasaDolarPeso() {
    try {
        const respuesta = await axios.get(`${BASE_URL}/USD`, {
            timeout: 10000
        })

        if (!respuesta.data?.rates?.MXN) {
            throw new Error('No se encontró tasa MXN')
        }

        const tasa = respuesta.data.rates.MXN
        
        console.log(`[INFO] Tipo de cambio: 1 USD = ${tasa} MXN`)
        
        return {
            tasa: parseFloat(tasa.toFixed(2)),
            fecha: new Date().toLocaleDateString('es-MX'),
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('[ERROR] Fallo al obtener tipo de cambio:', error.message)
        throw new Error(`No se puede obtener el tipo de cambio: ${error.message}`)
    }
}
