<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="appointment-modal">
      <q-card-section class="appointment-header">
        <div class="text-h5 text-weight-bold text-center">Agenda tu cita fácilmente</div>
      </q-card-section>
      
      <q-card-section class="appointment-content">
        <div class="appointment-options">
          <!-- Botón Nueva Cita -->
          <q-btn
            class="appointment-option-btn new-appointment-btn"
            @click="openNewAppointment"
            :loading="newAppointmentLoading"
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
            @click="openHistory"
            :loading="historyLoading"
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
            @click="closeModal"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'new-appointment', 'history', 'cancel'])

const $q = useQuasar()

// Controlar la visibilidad del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos reactivos
const newAppointmentLoading = ref(false)
const historyLoading = ref(false)

// Métodos
const openNewAppointment = async () => {
  newAppointmentLoading.value = true
  
  try {
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Emitir evento para abrir nueva cita
    emit('new-appointment')
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al abrir nueva cita',
      position: 'top'
    })
  } finally {
    newAppointmentLoading.value = false
  }
}

const openHistory = async () => {
  historyLoading.value = true
  
  try {
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Emitir evento para abrir historial
    emit('history')
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al abrir historial',
      position: 'top'
    })
  } finally {
    historyLoading.value = false
  }
}

const closeModal = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<!-- Los estilos están en app.scss global -->
