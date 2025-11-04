<template>
  <q-dialog v-model="estaAbierto" persistent>
    <q-card class="appointment-modal">
      <q-card-section class="appointment-header">
        <div class="text-h5 text-weight-bold text-center">Agenda tu cita fácilmente</div>
      </q-card-section>
      
      <q-card-section class="appointment-content">
        <div class="appointment-options">
          <!-- Botón Nueva Cita -->
          <q-btn
            class="appointment-option-btn new-appointment-btn"
            @click="abrirNuevaReserva"
            :loading="reservaStore.cargandoNuevaReserva"
          >
            <div class="option-content">
              <div class="option-icon">
                <q-icon name="event" size="3em" />
              </div>
              <div class="option-text">Nueva Cita</div>
            </div>
          </q-btn>
          
          <!-- Botón Historial -->
          <q-btn
            class="appointment-option-btn history-btn"
            @click="abrirHistorial"
            :loading="reservaStore.cargandoHistorial"
          >
            <div class="option-content">
              <div class="option-icon">
                <q-icon name="history" size="3em" />
              </div>
              <div class="option-text">Historial</div>
            </div>
          </q-btn>
        </div>
        
        <!-- Botón Cancelar -->
        <div class="cancel-section">
          <q-btn
            class="cancel-btn"
            @click="cerrarModal"
            flat
          >
            Cancelar
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReserveStore } from 'src/stores/reserva'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'new-appointment', 'history', 'cancelar'])

const $q = useQuasar()
const reservaStore = useReserveStore()

// Estado del modal controlado por el padre + store
const estaAbierto = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor)
})

// Métodos
const abrirNuevaReserva = async () => {
  reservaStore.cargandoNuevaReserva = true
  try {
    await reservaStore.simularCarga()
    emit('new-appointment')
    cerrarModal()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al abrir nueva reserva',
      position: 'top'
    })
  } finally {
    reservaStore.cargandoNuevaReserva = false
  }
}

const abrirHistorial = async () => {
  reservaStore.cargandoHistorial = true
  try {
    await reservaStore.simularCarga()
    emit('history')
    cerrarModal()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al abrir historial',
      position: 'top'
    })
  } finally {
    reservaStore.cargandoHistorial = false
  }
}

const cerrarModal = () => {
  emit('cancelar')
  estaAbierto.value = false
  reservaStore.cerrarModal()
}
</script>


