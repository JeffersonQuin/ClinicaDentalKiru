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

<style scoped>
.appointment-modal {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.appointment-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.appointment-content {
  padding: 32px 24px 24px 24px;
}

.appointment-options {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 32px;
}

.appointment-option-btn {
  background: #ffffff;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 24px 32px;
  min-width: 160px;
  min-height: 140px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.appointment-option-btn:hover {
  background: #f8f9fa;
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.appointment-option-btn:active {
  transform: translateY(0);
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f5f5f5;
  transition: all 0.3s ease;
}

.appointment-option-btn:hover .option-icon {
  background: #e3f2fd;
  transform: scale(1.1);
}

.option-text {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #1a1a1a;
}

.cancel-section {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn {
  background: #ffffff;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #666666;
  transform: translateY(-1px);
}

/* Modo oscuro */
.body--dark .appointment-modal {
  background: #2a2a2a !important;
  border: 1px solid #404040 !important;
}

.body--dark .appointment-header {
  border-bottom: 1px solid #404040 !important;
}

.body--dark .appointment-header .text-h5 {
  color: #ffffff !important;
}

.body--dark .appointment-option-btn {
  background: #2a2a2a !important;
  color: #ffffff !important;
  border-color: #404040 !important;
}

.body--dark .appointment-option-btn:hover {
  background: #333333 !important;
  border-color: #1976d2 !important;
}

.body--dark .option-icon {
  background: #404040 !important;
}

.body--dark .appointment-option-btn:hover .option-icon {
  background: #1a237e !important;
}

.body--dark .option-text {
  color: #ffffff !important;
}

.body--dark .cancel-section {
  border-top: 1px solid #404040 !important;
}

.body--dark .cancel-btn {
  background: #2a2a2a !important;
  color: #ffffff !important;
  border-color: #404040 !important;
}

.body--dark .cancel-btn:hover {
  background: #333333 !important;
  border-color: #666666 !important;
}

/* Responsive */
@media (max-width: 600px) {
  .appointment-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
  
  .appointment-content {
    padding: 24px 16px 20px 16px;
  }
  
  .appointment-options {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  
  .appointment-option-btn {
    min-width: 200px;
    min-height: 120px;
    padding: 20px 24px;
  }
  
  .option-icon {
    width: 50px;
    height: 50px;
  }
  
  .option-text {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .appointment-option-btn {
    min-width: 180px;
    min-height: 110px;
    padding: 16px 20px;
  }
  
  .option-icon {
    width: 45px;
    height: 45px;
  }
  
  .option-text {
    font-size: 14px;
  }
}
</style>
