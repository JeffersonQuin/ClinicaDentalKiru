<template>
  <q-dialog v-model="isOpen" maximized>
    <q-card class="appointment-history">
      <!-- Header -->
      <q-card-section class="history-header">
        <div class="header-content">
          <h2 class="history-title">Agenda tu cita fácilmente</h2>
          <p class="user-email">{{ userEmail }}</p>
          <q-btn 
            flat 
            round 
            icon="close" 
            @click="closeModal"
            class="close-btn"
          />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="history-content">
        <h3 class="section-title">Citas programadas:</h3>
        
        <div v-if="appointments.length === 0" class="empty-state">
          <q-icon name="event_busy" size="64px" color="grey-5" />
          <p class="empty-text">No tienes citas programadas</p>
        </div>
        
        <div v-else class="appointments-list">
          <div 
            v-for="(appointment, index) in appointments" 
            :key="appointment.id"
            class="appointment-card"
          >
            <div class="appointment-number">{{ index + 1 }}</div>
            <div class="appointment-details">
              <div class="detail-item">
                <strong>Nombre:</strong> {{ appointment.nombrePaciente }}
              </div>
              <div class="detail-item">
                <strong>Sucursal:</strong> {{ appointment.nombreSucursal }}
              </div>
              <div class="detail-item">
                <strong>Fecha:</strong> {{ appointment.fecha }}
              </div>
              <div class="detail-item">
                <strong>Hora:</strong> {{ appointment.hora }}
              </div>
              <div class="detail-item">
                <strong>Servicio:</strong> {{ appointment.servicio }}
              </div>
            </div>
            <q-btn 
              flat 
              color="negative" 
              icon="delete" 
              @click="deleteAppointment(appointment.id)"
              class="delete-btn"
              size="sm"
            >
              Eliminar
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReserveStore } from '../stores/reserva'

// Props
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Quasar
const $q = useQuasar()

// Pinia
const reservaStore = useReserveStore()

// Estado del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos del usuario
const userEmail = computed(() => reservaStore.correoUsuario)

// Lista de citas desde Pinia
const appointments = computed(() => reservaStore.citas)

// Métodos
const closeModal = () => {
  isOpen.value = false
}

const deleteAppointment = (appointmentId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar esta cita?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    reservaStore.eliminarCita(appointmentId)
    $q.notify({
      type: 'positive',
      message: 'Cita eliminada exitosamente'
    })
  })
}
</script>
