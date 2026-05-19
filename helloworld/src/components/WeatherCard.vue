<template>
    <div class="card">
        <h2>Clima en {{ciudad}}</h2>
        <p v-if='cargar' >Cargando...</p>
        <p v-else-if="error">{{error}}</p>
        <div v-else> 
            <p><b>Temperatura: </b> {{temperatura}}°C </p>
            <p><b>Viento: </b> {{viento}} km/h</p>
        </div>
        <button @click="obtenerClima">Actualizar </button>
    </div>
    <div class="searchbox">
        <input type="text"
        v-model="busqueda"
        @keyup.enter="obtenerCiudad"
        placeholder="Escriba una ciudad. Ej: Cancun"/>
        <button @click="obtenerCiudad" :disabled="cargandoC">
            {{ cargandoC? 'Buscando...':'Buscar ciudad' }}             
        </button>
        <hr/>
        <div class="ciudadInfo " v-if="ciudadInfo">
            <h2> {{ ciudadInfo.nombre }}</h2>
            <p> <b> Nombre Completo: </b>{{ ciudadInfo.nombre_completo }}</p>
            <p><small> Tipo:{{ ciudadInfo.tipo }} </small></p>
        </div>
        <p class="error" v-if="ErrorC">{{ ErrorC }}</p>
    </div>

</template>
<style scoped>
.card {
    border: 1px solid #02638a;
    border-radius: 12px;
    padding: 16px;
    max-width: 320px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
h2{
    color: #04435c;
}
.error{
    color: #be0b0b;
}
button{
    background-color: #02638a;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
}
</style>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'

//--- Declarar las variables reactivos
const ciudad = ref('Cancun')
const temperatura = ref(null)
const viento = ref(null)
const cargar = ref(false)
const lat = ref(20.97)
const lng = ref(-86.93)
const error = ref('')
const busqueda =ref('')
const ciudadInfo = ref(null)
const cargandoC = ref(false)
const ErrorC= ref(null)

// Función para llamar a la API
async function obtenerClima(params) {
    cargar.value=true
    error.value=''
    try{
        const res = await axios.get(
            'https://api.open-meteo.com/v1/forecast',{
            params:{
                latitude: lat.value,
                longitude: lng.value,
                current: 'temperature_2m,wind_speed_10m',
                timezone: 'America/Cancun'
            }
            }
        )
        temperatura.value = res.data.current.temperature_2m
        viento.value = res.data.current.wind_speed_10m

    } catch(e){
        error.value ='Falla al obtener el clima'
    } finally {
        cargar.value=false

    }  
}
//Obtener la ciudad
const obtenerCiudad = async() =>{
    if(!busqueda.value) return;
    cargandoC.value= true;
    ErrorC.value=null;
    ciudadInfo.value= null;
    try{
        const url= `https://nominatim.openstreetmap.org/search?q=${busqueda.value}&format=json`;
        const {data}= await axios.get(url);
        if(data && data.length > 0){
            const respuesta = data.find(i=>i.addresstype === 'city' || i.addresstype === 'town') ||data[0];
            ciudadInfo.value = {
                nombre: respuesta.name,
                nombre_completo: respuesta.display_name,
                tipo: respuesta.addresstype
            }
            // Actualizar coordenadas y nombre de la ciudad
            lat.value = parseFloat(respuesta.lat);
            lng.value = parseFloat(respuesta.lon);
            ciudad.value = respuesta.name;
            // Obtener el clima de la nueva ciudad
            await obtenerClima();
        }else {
            ErrorC.value = "Ciudad no localizada";
        }
    } catch(e) {
        ErrorC.value = "Error de conexión";

    } finally{
        cargandoC.value = false;

    }
}
//ciclo de vida: onMounted
onMounted(()=>obtenerClima())

// Exportar la función para que esté disponible en el template
defineExpose({ obtenerCiudad })
</script>