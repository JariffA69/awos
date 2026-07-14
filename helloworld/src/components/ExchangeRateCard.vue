<template>
    <div class="exchange-card">
        <header>
            <div>
                <h2>💱 Dólar a Pesos</h2>
                <span class="actualizacion">{{ store.tiempoActualizacion }}</span>
            </div>
            <button @click="refrescar" :disabled="store.cargando" class="btn-refrescar">
                🔄
            </button>
        </header>

        <!-- Loading state -->
        <div v-if="store.cargando" class="estado">
            <span class="spinner">⌛</span> Actualizando...
        </div>

        <!-- Error state -->
        <div v-else-if="store.error" class="estado error">
            ⚠️ {{ store.error }}
        </div>

        <!-- Tipo de cambio -->
        <div v-else-if="store.tasa" class="datos">
            <div class="tasa-grande">
                <span class="moneda-from">1 USD</span>
                <span class="flecha">=</span>
                <span class="tasa-numero">${{ store.tasa }}</span>
                <span class="moneda-to">MXN</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.exchange-card {
    border: 2px solid #10b981;
    border-radius: 16px;
    padding: 28px;
    max-width: 400px;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f0fdf4;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

header h2 {
    margin: 0;
    color: #065f46;
    font-size: 24px;
}

.actualizacion {
    color: #6b7280;
    font-size: 12px;
    display: block;
    margin-top: 4px;
}

.btn-refrescar {
    background: #10b981;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-refrescar:hover:not(:disabled) {
    background: #059669;
}

.btn-refrescar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.estado {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
    font-size: 16px;
}

.spinner {
    display: inline-block;
    margin-right: 8px;
}

.estado.error {
    color: #991b1b;
    background-color: #fee2e2;
    border-radius: 8px;
}

.datos {
    display: flex;
    justify-content: center;
}

.tasa-grande {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.moneda-from {
    font-size: 18px;
    color: #065f46;
    font-weight: bold;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #d1fae5;
}

.flecha {
    font-size: 24px;
    color: #10b981;
    font-weight: bold;
}

.tasa-numero {
    font-size: 36px;
    font-weight: bold;
    color: #10b981;
}

.moneda-to {
    font-size: 18px;
    color: #065f46;
    font-weight: bold;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #d1fae5;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { useExchangeRateStore } from '../stores/exchangeRateStore'

const store = useExchangeRateStore()

async function refrescar() {
    await store.cargarTasa()
}

// Cargar tasa al montar el componente
onMounted(() => {
    store.cargarTasa()
})
</script>
