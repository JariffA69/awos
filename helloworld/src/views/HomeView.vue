<script setup>
import { useWeatherStore } from '../stores/weatherStore'
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import ExchangeRateCard from '../components/ExchangeRateCard.vue'

const store = useWeatherStore()

async function onBuscar(ciudad) {
    try {
        // Llamar a Nominatim para obtener coordenadas
        const respuesta = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: ciudad,
                format: 'json',
                limit: 1
            }
        })

        if (respuesta.data.length === 0) {
            store.error = 'Ciudad no encontrada'
            return
        }

        const { name, lat, lon } = respuesta.data[0]
        
        // Actualizar el store con la nueva ciudad y coordenadas
        store.setCiudad(name, parseFloat(lat), parseFloat(lon))
        
    } catch (error) {
        store.error = 'Error al buscar la ciudad'
        console.error(error)
    }
}
</script>
<template>
    <section class="home">
        <h1>WeatherScope</h1>
        <p class="subtitle">Clima en tiempo real </p>
        <SearchBar @buscar="onBuscar" />
        <div class="contenedor-widgets">
            <WeatherCard />
            <ExchangeRateCard />
        </div>
    </section>
</template>
<style scoped>
.home{
    padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.contenedor-widgets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
    margin-top: 20px;
}
h1{
    color: #1e3a5F; font-size: 2rem; margin-bottom: 8px;
}
.subtitle{
    color: #64748b;
    margin-bottom: 32x;
}
</style>