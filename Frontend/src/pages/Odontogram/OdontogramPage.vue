<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-tooth header-icon"></i>
          <div>
            <h1 class="page-title">Odontograma</h1>
            <p class="page-subtitle">Visualiza y gestiona el tratamiento dental del paciente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Componente de búsqueda -->
    <SearchPaciente />

    <!-- Contenido del Odontograma (cuando se selecciona paciente) -->
    <div v-if="pacienteSeleccionado" class="odontograma-container">
      <q-card>
        <h4 class="text-center text-weight-bold">Odontograma de {{ pacienteSeleccionado.nombre }}</h4>


        <q-card-section>
          <p>El odontograma se renderizará aquí</p>
          <!-- Aquí va la lógica del odontograma -->
        </q-card-section>
      </q-card>
    </div>

    <!-- Mensaje cuando no hay paciente seleccionado -->
    <div v-else class="no-patient">
      <q-card>
        <q-card-section class="text-center q-pa-lg">
          <i class="fa-solid fa-inbox text-grey-5" style="font-size: 48px;"></i>
          <p class="text-h6 text-grey-7 q-mt-md">Selecciona un paciente</p>
          <p class="text-body2 text-grey-6">
            Ingresa el CI del paciente en el campo de búsqueda para comenzar
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePacientesStore } from 'src/stores/pacientes'
import SearchPaciente from '../../components/SearchPatien.vue'

const store = usePacientesStore()

// Carga pacientes al montar
onMounted(() => {
  store.cargarPacientes()
})

// Computed
const pacienteSeleccionado = computed(() => store.pacienteSeleccionado)
</script>

<style lang="scss" scoped>
.text-center {
  color: $blue-10;
}
</style>
