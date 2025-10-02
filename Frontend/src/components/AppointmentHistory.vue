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
                <strong>Nombre:</strong> {{ appointment.patientName }}
              </div>
              <div class="detail-item">
                <strong>Sucursal:</strong> {{ appointment.clinicName }}
              </div>
              <div class="detail-item">
                <strong>Fecha:</strong> {{ appointment.date }}
              </div>
              <div class="detail-item">
                <strong>Hora:</strong> {{ appointment.time }}
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Quasar
const $q = useQuasar()

// Estado del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos del usuario (simulado)
const userEmail = ref('Cliente@gmail.com')

// Lista de citas (simulada)
const appointments = ref([
  {
    id: 1,
    patientName: 'Pablo Martinez Valle',
    clinicName: 'Sucursal 1',
    date: '17/9/2025',
    time: '13:00',
    service: 'Limpieza Dental'
  },
  {
    id: 2,
    patientName: 'Maria Garcia Lopez',
    clinicName: 'Sucursal 2',
    date: '20/9/2025',
    time: '10:00',
    service: 'Ortodoncia'
  }
])

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
    // Eliminar la cita de la lista
    const index = appointments.value.findIndex(apt => apt.id === appointmentId)
    if (index > -1) {
      appointments.value.splice(index, 1)
      
      $q.notify({
        type: 'positive',
        message: 'Cita eliminada exitosamente'
      })
    }
  })
}

// Cargar citas del usuario (simulado)
const loadAppointments = () => {
  // Aquí se cargarían las citas reales del usuario desde una API
  console.log('Cargando citas del usuario:', userEmail.value)
}

// Cargar citas cuando el componente se monte
onMounted(() => {
  loadAppointments()
})
</script>

<!-- Estilos movidos a app.scss para mejor mantenimiento -->
