<template>
  <q-dialog v-model="reservaStore.modalAbierto" maximized>
    <q-card class="new-appointment-form">
      <!-- Header del formulario -->
      <q-card-section class="form-header">
        <div class="row items-center justify-between">
          <div class="text-h4 text-weight-bold">Agenda tu cita fácilmente</div>
          <q-btn 
            flat 
            round 
            icon="close" 
            v-close-popup 
          />
        </div>

        <!-- Indicador de pasos -->
        <div class="steps-indicator">
          <div 
            v-for="(step, index) in reservaStore.steps" 
            :key="index"
            class="step-item"
            :class="{ 
              'active': reservaStore.currentStep === index,
              'completed': reservaStore.currentStep > index 
            }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="form-content">
        <!-- Paso 1: Motivo -->
        <div v-if="reservaStore.currentStep === 0" class="step-container">
          <div class="step-content">
            <!-- ¿Para quién es la cita? -->
            <div class="section">
              <h3 class="section-title">¿Para quién es la cita?</h3>
              <q-radio 
                v-model="reservaStore.nuevaReserva.patientType" 
                val="me" 
                label="Para mí"
                class="q-mb-md"
              />
              <q-radio 
                v-model="reservaStore.nuevaReserva.patientType" 
                val="other" 
                label="Para otra persona"
                class="q-mb-md"
              />

              <!-- Formulario para otra persona -->
              <div v-if="reservaStore.nuevaReserva.patientType === 'other'" class="other-patient-form">
                <div class="row q-gutter-md">
                  <!-- 👇 CAMBIO: Solo nombreCompleto en lugar de nombre + apellidos -->
                  <div class="col-12">
                    <q-input 
                      v-model="reservaStore.pacienteOtro.nombreCompleto" 
                      label="Nombre Completo" 
                      outlined 
                      dense
                      :rules="[val => !!val || 'Nombre completo es requerido']"
                    />
                  </div>
                </div>
                <div class="row q-gutter-md q-mt-md">
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="reservaStore.pacienteOtro.genero"
                      :options="['Masculino', 'Femenino']"
                      label="Género"
                      outlined
                      dense
                      :rules="[val => !!val || 'Género es requerido']"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="reservaStore.pacienteOtro.parentesco"
                      :options="['Hijo', 'Hija', 'Padre', 'Madre', 'Esposo', 'Esposa']"
                      label="Parentesco"
                      outlined
                      dense
                      :rules="[val => !!val || 'Parentesco es requerido']"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input 
                      v-model="reservaStore.pacienteOtro.telefono" 
                      label="Teléfono" 
                      outlined 
                      dense
                      :rules="[
                        val => !!val || 'Teléfono es requerido',
                        val => /^\d+$/.test(val) || 'Teléfono solo puede contener números'
                      ]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Selección de servicio -->
            <div class="section">
              <h3 class="section-title">Selecciona el servicio</h3>
              <div class="services-grid">
                <div 
                  v-for="service in services" 
                  :key="service.id"
                  class="service-option"
                  :class="{ 'selected': reservaStore.nuevaReserva.service === service.id }"
                  @click="reservaStore.seleccionarServicio(service.id)"
                >
                  <q-icon :name="service.icon" class="service-icon" size="32px" />
                  <span class="service-label">{{ service.name }}</span>
                </div>
                <q-banner v-if="reservaStore.nuevaReserva.service === null" class="q-mt-md" dense color="negative" text-color="white">
                  Por favor selecciona un servicio
                </q-banner>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 2: Clínica -->
        <div v-if="reservaStore.currentStep === 1" class="step-container">
          <div class="step-content">
            <h3 class="section-title">Selecciona la Clínica</h3>
            <div class="clinics-list">
              <div class="clinic-card" :class="{ 'selected': reservaStore.nuevaReserva.clinic === 1 }" @click="reservaStore.seleccionarClinica(1)">
                <div class="clinic-info">
                  <h4 class="clinic-name">Sucursal 1 de Oruro</h4>
                  <p class="clinic-address">Dirección: Av. 6 de Octubre #567, Oruro</p>
                </div>
              </div>
              <div class="clinic-card" :class="{ 'selected': reservaStore.nuevaReserva.clinic === 2 }" @click="reservaStore.seleccionarClinica(2)">
                <div class="clinic-info">
                  <h4 class="clinic-name">Sucursal 2 de Oruro</h4>
                  <p class="clinic-address">Dirección: Av. Ayacucho #345, Cochabamba</p>
                </div>
              </div>
              <q-banner v-if="reservaStore.nuevaReserva.clinic === null" class="q-mt-md" dense color="negative" text-color="white">
                Por favor selecciona una clínica
              </q-banner>
            </div>
          </div>
        </div>

        <!-- Paso 3: Fecha y Hora -->
<div v-if="reservaStore.currentStep === 2" class="step-container">
  <div class="step-content">
    <div class="row">
      <!-- Selección de fecha -->
      <div class="col-12 col-md-6">
        <h3 class="section-title">Selecciona la fecha</h3>
        <q-date 
          v-model="reservaStore.nuevaReserva.date" 
          :options="dateOptions" 
          class="calendar" 
          :rules="[val => !!val || 'Fecha es requerida']"
        />
      </div>

      <!-- Selección de hora -->
      <div class="col-12 col-md-6">
        <h3 class="section-title">Selecciona la hora</h3>

        <!-- Mostrar mensaje si es domingo -->
        <q-banner v-if="isSunday" dense color="negative" text-color="white" class="q-mb-sm">
          Los domingos no se puede reservar
        </q-banner>

        <!-- Mostrar horarios SOLO si NO es domingo -->
        <div v-else class="time-slots">
          <div 
            v-for="time in availableTimeSlots" 
            :key="time"
            class="time-slot"
            :class="{ 'selected': reservaStore.nuevaReserva.time === time }"
            @click="reservaStore.nuevaReserva.time = time"
          >
            {{ time }}
          </div>

          <!-- Banner si no hay hora seleccionada -->
          <q-banner 
            v-if="reservaStore.nuevaReserva.time === ''" 
            class="q-mt-md" dense color="negative" text-color="white"
          >
            Por favor selecciona una hora
          </q-banner>
        </div>
      </div>
    </div>
  </div>
</div>


        <!-- Paso 4: Validación -->
        <div v-if="reservaStore.currentStep === 3" class="step-container">
          <div class="step-content">
            <h3 class="section-title">Confirma tu cita</h3>
            <div class="appointment-summary">
              <!-- 👇 CAMBIOS: Nueva estructura de datos -->
              <div class="summary-item">
                <strong>Paciente:</strong> 
                <span>{{ reservaStore.nuevaReserva.patientType === 'me' ? 'Yo mismo' : reservaStore.pacienteOtro.nombreCompleto }}</span>
              </div>
              <div class="summary-item">
                <strong>Servicio:</strong> 
                <span>{{ services.find(s => s.id === reservaStore.nuevaReserva.service)?.name || 'No seleccionado' }}</span>
              </div>
              <div class="summary-item">
                <strong>Clínica:</strong> 
                <span>{{ reservaStore.nuevaReserva.clinic === 1 ? 'Sucursal 1' : 'Sucursal 2' }}</span>
              </div>
              <div class="summary-item">
                <strong>Fecha:</strong> 
                <span>{{ formatDateForDisplay(reservaStore.nuevaReserva.date) }}</span>
              </div>
              <div class="summary-item">
                <strong>Hora:</strong> 
                <span>{{ reservaStore.nuevaReserva.time }}</span>
              </div>
              
              <!-- 👇 NUEVO: Información del dependiente si aplica -->
              <div v-if="reservaStore.nuevaReserva.patientType === 'other'" class="dependiente-summary">
                <div class="summary-item">
                  <strong>Dependiente:</strong> 
                  <span>{{ reservaStore.pacienteOtro.nombreCompleto }}</span>
                </div>
                <div class="summary-item">
                  <strong>Parentesco:</strong> 
                  <span>{{ reservaStore.pacienteOtro.parentesco }}</span>
                </div>
                <div class="summary-item">
                  <strong>Género:</strong> 
                  <span>{{ reservaStore.pacienteOtro.genero }}</span>
                </div>
                <div class="summary-item">
                  <strong>Teléfono:</strong> 
                  <span>{{ reservaStore.pacienteOtro.telefono }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer con botones de navegación -->
      <q-card-actions class="form-footer">
        <q-btn flat label="ATRÁS" @click="reservaStore.pasoAnterior" :disable="reservaStore.currentStep === 0" class="back-btn" />
        <q-space />
        <q-btn 
          v-if="reservaStore.currentStep < 3" 
          color="primary" 
          label="SIGUIENTE" 
          @click="nextStep" 
          class="next-btn" 
        />
        <q-btn 
          v-else 
          color="primary" 
          label="CONFIRMAR CITA" 
          @click="confirmReservation" 
          class="confirm-btn" 
          :loading="reservaStore.cargandoNuevaReserva"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useReserveStore } from 'src/stores/reserva'
import { useQuasar } from 'quasar'

const reservaStore = useReserveStore()
const $q = useQuasar()

const services = ref([
  { id: 1, name: 'Limpieza Dental', icon: 'cleaning_services' },
  { id: 2, name: 'Extracción', icon: 'medical_services' },
  { id: 3, name: 'Ortodoncia', icon: 'straighten' },
  { id: 4, name: 'Endodoncia', icon: 'healing' },
  { id: 5, name: 'Prótesis', icon: 'build' },
  { id: 6, name: 'Blanqueamiento', icon: 'auto_fix_high' }
])

// 👇 ACTUALIZADO: Horarios dinámicos basados en disponibilidad del calendario
// Se actualiza automáticamente cuando cambia la fecha seleccionada
const availableTimeSlots = computed(() => {
  const horarios = reservaStore.obtenerHorariosDisponibles(reservaStore.nuevaReserva.date)

  // Filtrar solo entre 08:00 y 18:00
  return horarios.filter(hora => {
    const h = parseInt(hora.split(':')[0])
    return h >= 8 && h <= 18
  })
})

// 👇 NUEVO: Limpiar la hora seleccionada si ya no está disponible cuando cambia la fecha
watch(() => reservaStore.nuevaReserva.date, (newDate) => {
  // Si hay una hora seleccionada pero ya no está disponible, limpiarla
  if (reservaStore.nuevaReserva.time) {
    const horariosDisponibles = reservaStore.obtenerHorariosDisponibles(newDate)
    if (!horariosDisponibles.includes(reservaStore.nuevaReserva.time)) {
      reservaStore.nuevaReserva.time = ''
    }
  }
})

const isSunday = computed(() => {
  const dateStr = reservaStore.nuevaReserva.date
  if (!dateStr) return false

  let dateObj
  if (dateStr.includes('/')) {
    const [year, month, day] = dateStr.split('/')
    dateObj = new Date(year, month - 1, day)
  } else if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-')
    dateObj = new Date(year, month - 1, day)
  } else {
    return false
  }

  return dateObj.getDay() === 0 // 0 = Domingo
})


const dateOptions = (date) => {
  const today = new Date()
  const selectedDate = new Date(date)
  return selectedDate >= today
}

// 👇 Función para formatear fecha para mostrar
const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'No seleccionada'
  
  try {
    // El q-date devuelve formato: "2024/12/25" o "2024-12-25"
    // Convertir a Date object
    let date
    if (dateString.includes('/')) {
      const [year, month, day] = dateString.split('/')
      date = new Date(year, month - 1, day) // month - 1 porque Date usa 0-11
    } else if (dateString.includes('-')) {
      date = new Date(dateString)
    } else {
      return dateString // Si ya está en formato legible
    }
    
    // Formatear a DD/MM/YYYY
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

// Validación antes de avanzar
const nextStep = () => {
  if (reservaStore.currentStep === 0) {
    // 👇 CAMBIO: Validación con nuevos campos
    if (reservaStore.nuevaReserva.patientType === 'other') {
      const p = reservaStore.pacienteOtro
      if (!p.nombreCompleto || !p.genero || !p.parentesco || !/^\d+$/.test(p.telefono)) {
        $q.notify({ 
          type: 'negative', 
          message: 'Por favor completa todos los campos del dependiente correctamente' 
        })
        return
      }
    }
    if (!reservaStore.nuevaReserva.service) {
      $q.notify({ type: 'negative', message: 'Selecciona un servicio' })
      return
    }
  } else if (reservaStore.currentStep === 1 && !reservaStore.nuevaReserva.clinic) {
    $q.notify({ type: 'negative', message: 'Selecciona una clínica' })
    return
  } else if (reservaStore.currentStep === 2 && (!reservaStore.nuevaReserva.date || !reservaStore.nuevaReserva.time)) {
    $q.notify({ type: 'negative', message: 'Selecciona fecha y hora' })
    return
  }
  reservaStore.siguientePaso()
}

// 👇 ACTUALIZADO: Confirmar reserva con manejo de carga
const confirmReservation = () => {
  reservaStore.enviarReserva()
  $q.notify({ 
    type: 'positive', 
    message: '¡Cita registrada exitosamente!' 
  })
}
</script>