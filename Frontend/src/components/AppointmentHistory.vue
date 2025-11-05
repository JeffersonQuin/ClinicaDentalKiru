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
        
        <!-- Estado de carga -->
        <div v-if="cargandoHistorial" class="loading-state">
          <q-spinner size="50px" color="primary" />
          <p>Cargando reservas...</p>
        </div>
        
        <div v-else-if="appointments.length === 0" class="empty-state">
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
                <strong>Paciente:</strong> {{ appointment.nombreCompleto }}
              </div>
              <div class="detail-item">
                <strong>Sucursal:</strong> {{ appointment.sucursal }}
              </div>
              <div class="detail-item">
                <strong>Fecha:</strong> {{ formatDate(appointment.fechaReserva) }}
              </div>
              <div class="detail-item">
                <strong>Hora:</strong> {{ appointment.horaReserva }}
              </div>
              <div class="detail-item">
                <strong>Servicio:</strong> {{ appointment.servicio }}
              </div>
              
              <!-- 👇 NUEVO: Información del dependiente -->
              <div v-if="appointment.dependiente" class="dependiente-info">
                <div class="detail-item">
                  <strong>Dependiente:</strong> {{ appointment.dependiente.nombreCompleto }}
                </div>
                <div class="detail-item">
                  <strong>Parentesco:</strong> {{ appointment.dependiente.parentesco }}
                </div>
                <div class="detail-item">
                  <strong>Teléfono:</strong> {{ appointment.dependiente.telefono }}
                </div>
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

// 👇 DATOS DESDE PINIA
const userEmail = computed(() => reservaStore.correoUsuario)
const appointments = computed(() => reservaStore.reservasDelUsuario)
const cargandoHistorial = computed(() => reservaStore.cargandoHistorial)

// Métodos
const closeModal = () => {
  isOpen.value = false
}

const deleteAppointment = (appointmentId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar esta reserva?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    reservaStore.eliminarReserva(appointmentId)
    $q.notify({
      type: 'positive',
      message: 'Reserva eliminada exitosamente'
    })
  })
}

// 👇 CORREGIDO: Función para formatear fecha sin problemas de zona horaria
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  
  try {
    // Si ya está en formato DD/MM/YYYY, dejarlo igual
    if (dateString.includes('/') && dateString.split('/')[0].length === 2) {
      return dateString
    }
    
    // Si está en formato YYYY-MM-DD, convertir manualmente
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-')
      // Usar el método seguro sin problemas de zona horaria
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
    
    // Si está en formato YYYY/MM/DD, convertir manualmente
    if (dateString.includes('/') && dateString.split('/')[0].length === 4) {
      const [year, month, day] = dateString.split('/')
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
    
    // Para otros formatos, intentar con Date (con ajuste de zona horaria)
    const date = new Date(dateString)
    
    // Ajustar por diferencia de zona horaria
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    
    if (!isNaN(adjustedDate.getTime())) {
      return adjustedDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    
    return 'Fecha inválida'
  } catch {
    return 'Fecha inválida'
  }
}
</script>

