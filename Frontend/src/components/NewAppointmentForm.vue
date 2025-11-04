<template>
  <q-dialog v-model="reservaStore.modalAbierto" maximized >
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
                  <div class="col-12 col-md-4">
                    <q-input 
                      v-model="reservaStore.pacienteOtro.nombre" 
                      label="Nombre" 
                      outlined 
                      dense
                      :rules="[val => !!val || 'Nombre es requerido']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input 
                      v-model="reservaStore.pacienteOtro.apellidoPaterno" 
                      label="Apellido Paterno" 
                      outlined 
                      dense
                      :rules="[val => !!val || 'Apellido Paterno es requerido']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input 
                      v-model="reservaStore.pacienteOtro.apellidoMaterno" 
                      label="Apellido Materno" 
                      outlined 
                      dense
                      :rules="[val => !!val || 'Apellido Materno es requerido']"
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
                      :options="['Hijo', 'Padre']"
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
              <div class="col-12 col-md-6">
                <h3 class="section-title">Selecciona la fecha</h3>
                <q-date 
                  v-model="reservaStore.nuevaReserva.date" 
                  :options="dateOptions" 
                  class="calendar" 
                  :rules="[val => !!val || 'Fecha es requerida']"
                />
              </div>
              <div class="col-12 col-md-6">
                <h3 class="section-title">Selecciona la hora</h3>
                <div class="time-slots">
                  <div 
                    v-for="time in availableTimeSlots" 
                    :key="time"
                    class="time-slot"
                    :class="{ 'selected': reservaStore.nuevaReserva.time === time }"
                    @click="reservaStore.nuevaReserva.time = time"
                  >
                    {{ time }}
                  </div>
                </div>
                <q-banner v-if="reservaStore.nuevaReserva.time === ''" class="q-mt-md" dense color="negative" text-color="white">
                  Por favor selecciona una hora
                </q-banner>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 4: Validación -->
        <div v-if="reservaStore.currentStep === 3" class="step-container">
          <div class="step-content">
            <h3 class="section-title">Confirma tu cita</h3>
            <div class="appointment-summary">
              <div class="summary-item">
                <strong>Paciente:</strong> 
                <span>{{ reservaStore.nuevaReserva.patientType === 'me' ? 'Yo mismo' : `${reservaStore.pacienteOtro.nombre} ${reservaStore.pacienteOtro.apellidoPaterno}` }}</span>
              </div>
              <div class="summary-item">
                <strong>Servicio:</strong> 
                <span>{{ services.find(s => s.id === reservaStore.nuevaReserva.service)?.name || 'No seleccionado' }}</span>
              </div>
              <div class="summary-item">
                <strong>Clínica:</strong> 
                <span>{{ reservaStore.nuevaReserva.clinic === 1 ? 'Sucursal 1 de Oruro' : 'Sucursal 2 de Oruro' }}</span>
              </div>
              <div class="summary-item">
                <strong>Fecha:</strong> 
                <span>{{ reservaStore.nuevaReserva.date }}</span>
              </div>
              <div class="summary-item">
                <strong>Hora:</strong> 
                <span>{{ reservaStore.nuevaReserva.time }}</span>
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
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
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

const availableTimeSlots = ref([
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
])

const dateOptions = (date) => {
  const today = new Date()
  const selectedDate = new Date(date)
  return selectedDate >= today
}

// Validación antes de avanzar
const nextStep = () => {
  if (reservaStore.currentStep === 0) {
    // Validar paciente y servicio
    if (reservaStore.nuevaReserva.patientType === 'other') {
      const p = reservaStore.pacienteOtro
      if (!p.nombre || !p.apellidoPaterno || !p.apellidoMaterno || !p.genero || !p.parentesco || !/^\d+$/.test(p.telefono)) {
        $q.notify({ type: 'negative', message: 'Por favor completa todos los campos correctamente' })
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

// Confirmar reserva
const confirmReservation = () => {
  reservaStore.enviarReserva()
  $q.notify({ type: 'positive', message: '¡Cita registrada exitosamente!' })
}
</script>
