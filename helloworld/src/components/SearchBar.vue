<template>
    <div class="search-bar">
        <input 
            v-model="ciudadInput" 
            type="text" 
            placeholder="Ingresa el nombre de la ciudad"
            @keyup.enter="buscar"
        />
        <button @click="buscar">Buscar</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const ciudadInput = ref('')

const emit = defineEmits(['buscar'])

function buscar() {
    if (ciudadInput.value.trim()) {
        emit('buscar', ciudadInput.value)
        ciudadInput.value = ''
    }
}
</script>

<style scoped>
.search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 10px 15px;
    border: 2px solid #2563EB;
    border-radius: 8px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
}

input:focus {
    outline: none;
    border-color: #1e3a5f;
}

button {
    background: #2563EB;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
}

button:hover {
    background: #1e40af;
}

button:active {
    opacity: 0.8;
}
</style>
