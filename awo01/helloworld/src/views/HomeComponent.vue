<!--Estructura SFC (3 partes: HTML, JS y CSS)-->
<script setup>
//1. Importaciones: otros componentes, servicios, composables
import {ref,computed,onMounted} from 'vue'
import {useWeatherStore} from '@/stores/weatherStore'

//2. Estados locales- Solo datos que este componente necesita
const extra = ref(false)

//3. Estado global - desde el store de pinia.
const store = useWeatherStore();

//4. Valores computados - derivadas del estado de datos en nuestro store
const iconClima = computed(() =>store.temperatura<25 ? '-':'+')

//5. Ciclo de vida
onMounted(()=>console.log('componente listo'))

</script>
<template>
    <div class="weather-card">
        <span>{{ iconClima }}</span>
        <p>{{ store.temperatura }}°C</p>
        <button class="masinfo" @click="extra=!extra">
            {{ extra? 'Ver menos...' : 'Ver más...' }}
        </button>
    </div>
</template>
<style scoped>
/*scoped = estilos que se aplicarán a este componente */
.weather-card{
    padding:24px;
    border-radius: 12px;
}
</style>

v-bind (:) 